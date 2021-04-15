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

@Component({
  selector: "c-vaccination-list",
  templateUrl: "./vaccination-list.component.html"
})
export class VaccinationListComponent implements OnInit {
  vaccinations: Vaccination[];
  locations: Location[];
  selectedLocationId: number;
  vaccination: Vaccination = VaccinationFactory.empty();
  activeUser: User = UserFactory.empty();
  activeUserVaccinationDetails: Vaccination;
  createForm: FormGroup;

  @Output() showDetailsEvent = new EventEmitter<Vaccination>();

  constructor(
    private vs: VaccinationService,
    private us: UserService,
    private ls: LocationService,
    private toastr: ToastrService,
    public authService: AuthenticationService,
    private fb: FormBuilder,
  ) {}

  showDetails(vaccination: Vaccination) {
    this.showDetailsEvent.emit(vaccination);
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      location: ["", [Validators.required]],
      dateOfVaccination: ["", [Validators.required]],
      fromTime: ["", [Validators.required]],
      toTime: ["", [Validators.required]],
      maxParticipants: ["", [Validators.required, Validators.min(1)]],
    });

    this.vs.getAll().subscribe(res => {
      this.vaccinations = res;
    });

    this.ls.getAllLocations().subscribe(res => {
      this.locations = res;
    });

    if (this.authService.isLoggedIn()) {
      this.us
        .getSingleUserById(this.authService.getCurrentUserId())
        .subscribe(res => {
          this.activeUser = res;
          if (this.activeUser.vaccination_id != null) {
            this.activeUserVaccinationDetails = this.vaccinations[
              this.activeUser.vaccination_id-1
            ];
          }
        });
    }
  }

  addVaccination() {
    if (confirm("Wollen sie diesen Termin wirklich anlegen?")) {
      this.vaccination.id = this.vaccinations.length + 1;
      this.vaccination.location_id = this.selectedLocationId;

      /*convert dates to ISO8601 */
      this.vaccination.dateOfVaccination = new Date(
        this.vaccination.dateOfVaccination
      );
      this.vaccination.fromTime = new Date(this.vaccination.fromTime);
      this.vaccination.toTime = new Date(this.vaccination.toTime);

      /*empty users from factory draft */
      this.vaccination.users = [];

      this.vs.addVaccination(this.vaccination).subscribe(res => {
        this.toastr.success(
          "Neuer Impftermin wurde erstellt",
          "Impftermin erstellt!"
        );
      });
    }
  }
}
