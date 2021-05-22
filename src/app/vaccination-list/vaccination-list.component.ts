import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Vaccination, Location, User } from "../shared/vaccination";
import { VaccinationFactory } from "../shared/vaccination-factory";
import { VaccinationService } from "../shared/vaccination.service";
import { ToastrService } from "ngx-toastr";
import { LocationService } from "../shared/location.service";
import { AuthenticationService } from "../shared/authentication.service";
import { UserFactory } from "../shared/user-factory";
import { UserService } from "../shared/user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";

@Component({
  selector: "c-vaccination-list",
  templateUrl: "./vaccination-list.component.html"
})
export class VaccinationListComponent implements OnInit {
  vaccinations: Vaccination[];
  locations: Location[];
  vaccination: Vaccination = VaccinationFactory.empty();
  activeUser: User = UserFactory.empty();
  createForm: FormGroup;

  @Output() showDetailsEvent = new EventEmitter<Vaccination>();

  constructor(
    private vs: VaccinationService,
    private us: UserService,
    private ls: LocationService,
    private toastr: ToastrService,
    public authService: AuthenticationService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    //reactive forms for new vaccination
    //date: it's a hack and it just works if you don't change the format, had some problems
    this.createForm = this.fb.group({
      location: ["", [Validators.required]],
      dateOfVaccination: ["", [Validators.required]],
      fromTime: [
        this.datePipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss"),
        [Validators.required]
      ],
      toTime: [
        this.datePipe.transform(new Date(), "yyyy-MM-dd hh:mm:ss"),
        [Validators.required]
      ],
      maxParticipants: ["", [Validators.required, Validators.min(1)]]
    });

    this.ls.getAllLocations().subscribe(res => {
      this.locations = res;
    });

    if (this.authService.isLoggedIn()) {
      this.us
        .getSingleUserById(this.authService.getCurrentUserId())
        .subscribe(res => {
          this.activeUser = res;
        });
    }

    this.vs.getAll().subscribe(res => {
      this.vaccinations = res;
    });
  }

  //show vaccination details
  showDetails(vaccination: Vaccination) {
    this.showDetailsEvent.emit(vaccination);
  }

  //add new vaccination
  addVaccination() {
    const val = this.createForm.value;

    if (confirm("Wollen sie diesen Termin wirklich anlegen?")) {
      this.vaccination.id = this.vaccinations.length + 1;
      this.vaccination.location_id = val.location;
      this.vaccination.dateOfVaccination = new Date(val.dateOfVaccination);
      this.vaccination.fromTime = val.fromTime;
      this.vaccination.toTime = val.toTime;
      this.vaccination.maxParticipants = val.maxParticipants;

      /*empty users from factory draft */
      this.vaccination.users = [];

      this.vs.addVaccination(this.vaccination).subscribe(res => {
        this.toastr.success(
          "Neuer Impftermin wurde erstellt",
          "Impftermin erstellt!"
        );
        this.ngOnInit();
      });
    }
  }
}
