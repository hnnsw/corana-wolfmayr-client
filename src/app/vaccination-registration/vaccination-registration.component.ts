import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "../shared/authentication.service";
import { UserFactory } from "../shared/user-factory";
import { UserService } from "../shared/user.service";
import { User, Vaccination } from "../shared/vaccination";
import { VaccinationFactory } from "../shared/vaccination-factory";
import { VaccinationService } from "../shared/vaccination.service";

@Component({
  selector: "can-vaccination-registration",
  templateUrl: "./vaccination-registration.component.html"
})
export class VaccinationRegistrationComponent implements OnInit {
  vaccination: Vaccination = VaccinationFactory.empty();
  activeUser: User = UserFactory.empty();
  selectedGender: string;
  genders: string[] = ["männlich", "weiblich", "divers"];

  constructor(
    private vs: VaccinationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private us: UserService,
    public authService: AuthenticationService
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.vs.getSingle(params["id"]).subscribe(res => {
      this.vaccination = res;
    });

    if (this.authService.isLoggedIn()) {
      this.us
        .getSingleUserById(this.authService.getCurrentUserId())
        .subscribe(res => {
          this.activeUser = res;
        });
    }
  }

  addUserToVaccination() {
    if (confirm("Willst du dich wirklich zu diesen Impftermin anmelden?")) {
      this.activeUser.vaccination_id = this.vaccination.id;
      this.activeUser.gender = this.selectedGender;

      this.us.saveUser(this.activeUser).subscribe(res => {
        this.toastr.success(
          "Du hast dich erfolgreich zur Impfung angemeldet!",
          "Anmeldung erfolgreich!"
        );
        this.router.navigate(["../../"], { relativeTo: this.route });
      });
    }
  }
}
