import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationFactory } from "../shared/location-factory";
import { User, Vaccination, Location } from "../shared/vaccination";
import { ToastrService } from "ngx-toastr";
import { VaccinationFactory } from "../shared/vaccination-factory";
import { VaccinationService } from "../shared/vaccination.service";
import { DatePipe } from "@angular/common";
import { LocationService } from "../shared/location.service";
import { UserService } from "../shared/user.service";
import { UserFactory } from "../shared/user-factory";
import { AuthenticationService } from "../shared/authentication.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "c-vaccination-details",
  templateUrl: "./vaccination-details.component.html"
})
export class VaccinationDetailsComponent implements OnInit {
  locations: Location[];
  users: User[];
  activeUser: User = UserFactory.empty();
  vaccination: Vaccination = VaccinationFactory.empty();
  vaccinationPassed: boolean = false;
  editForm: FormGroup;

  @Output() showDetailsEvent = new EventEmitter<User>();

  constructor(
    private vs: VaccinationService,
    private ls: LocationService,
    private us: UserService,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  showDetails(user: User) {
    this.showDetailsEvent.emit(user);
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.vs.getSingle(params["id"]).subscribe(res => {
      this.vaccination = res;
      this.vaccination.fromTime = new Date(this.vaccination.fromTime);
      this.vaccination.toTime = new Date(this.vaccination.toTime);
      this.users = this.vaccination.users;
      this.vaccinationPassed = this.isPassed(this.vaccination.dateOfVaccination);

      if (this.authService.isLoggedIn()) {
        this.us
          .getSingleUserById(this.authService.getCurrentUserId())
          .subscribe(res => {
            this.activeUser = res;
          });
      }

      //reactive forms for edit vaccination
      //date: it's a hack and it just works if you don't change the format, had some problems
      this.editForm = this.fb.group({
        location: [this.vaccination?.location_id, [Validators.required]],
        dateOfVaccination: [
          this.vaccination?.dateOfVaccination,
          [Validators.required]
        ],
        fromTime: [
          this.datePipe.transform(this.vaccination?.fromTime, "yyyy-MM-dd hh:mm:ss"),
          //this.vaccination?.fromTime,
          [Validators.required]
        ],
        toTime: [
          this.datePipe.transform(this.vaccination?.toTime, "yyyy-MM-dd hh:mm:ss"),
          //this.vaccination?.toTime,
          [Validators.required]
        ],
        maxParticipants: [
          this.vaccination?.maxParticipants,
          [Validators.required, Validators.min(1)]
        ]
      });
    });

    this.ls.getAllLocations().subscribe(res => {
      this.locations = res;
    });
  }

  //check if vaccination date is passed
  isPassed(vaccinationDate){
     if (this.datePipe.transform(vaccinationDate,"yyyy-MM-dd") > this.datePipe.transform(new Date(), "yyyy-MM-dd")) {
        return true;
      }
      return false;
  }

  //delete vaccination
  removeVaccination() {
    if (confirm("Wollen Sie diesen Termin wirklich löschen?")) {
      this.vs.remove(this.vaccination.id).subscribe(res => {
        this.toastr.success(
          "Impftermin erfolgreich gelöscht",
          "Impftermin gelöscht!"
        );
        this.router.navigate(["../../"], { relativeTo: this.route });
      });
    }
  }

  //edit vaccination information 
  saveVaccination() {
    const val = this.editForm.value;

    if (confirm("Wollen sie diese Änderungen wirklich speichern?")) {
      this.vaccination.location_id = val.location;
      this.vaccination.dateOfVaccination = new Date(val.dateOfVaccination);
      this.vaccination.fromTime = val.fromTime;
      this.vaccination.toTime = val.toTime;
      this.vaccination.maxParticipants = val.maxParticipants;

      this.vs.saveVaccination(this.vaccination).subscribe(res => {
        this.toastr.success(
          "Impftermindetails wurden aktualisiert",
          "Impftermindetails aktualisiert!"
        );
      });
      this.router.navigate(["../../"], { relativeTo: this.route });
    }
  }
}
