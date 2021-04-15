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

@Component({
  selector: "c-vaccination-details",
  templateUrl: "./vaccination-details.component.html"
})
export class VaccinationDetailsComponent implements OnInit {
  vaccination: Vaccination = VaccinationFactory.empty();
  location: Location = LocationFactory.empty();
  locations: Location[];
  vaccinationPassed: boolean = false;
  selectedLocationId: number;
  users: User[];
  activeUser: User = UserFactory.empty();

  @Output() showDetailsEvent = new EventEmitter<User>();

  constructor(
    private vs: VaccinationService,
    private ls: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private us: UserService,
    public authService: AuthenticationService
  ) {}

  showDetails(user: User) {
    this.showDetailsEvent.emit(user);
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.vs.getSingle(params["id"]).subscribe(res => {
      this.vaccination = res;

      this.users = this.vaccination.users;
      this.location = this.vaccination.location;
      this.selectedLocationId = this.location.id;

      if (
        this.datepipe.transform(
          this.vaccination.dateOfVaccination,
          "yyyy-MM-dd"
        ) > this.datepipe.transform(new Date(), "yyyy-MM-dd")
      ) {
        this.vaccinationPassed = true;
      }

      if (this.authService.isLoggedIn()) {
        this.us
          .getSingleUserById(this.authService.getCurrentUserId())
          .subscribe(res => {
            this.activeUser = res;
          });
      }
    });

    this.ls.getAllLocations().subscribe(res => {
      this.locations = res;
    });
  }

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

  saveVaccination() {
    if (confirm("Wollen sie diese Änderungen wirklich speichern?")) {
      this.vaccination.location_id = this.selectedLocationId;
      this.vs.saveVaccination(this.vaccination).subscribe(res => {
        this.toastr.success(
          "Impftermindetails wurden aktualisiert",
          "Impftermindetails aktualisiert!"
        );
      });
    }
  }
}
