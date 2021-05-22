import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  registrationForm: FormGroup;

  constructor(
    private vs: VaccinationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private us: UserService,
    public authService: AuthenticationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      dateOfBirth: ["", [Validators.required]],
      socialSecurityNumber: ["", [Validators.required]],
      phonenumber: [
        "",
        [Validators.required, Validators.minLength(6), Validators.maxLength(15)]
      ],
      email: ["", [Validators.required]]
    });

    const params = this.route.snapshot.params;
    this.vs.getSingle(params["id"]).subscribe(res => {
      this.vaccination = res;
      this.vaccination.fromTime = new Date(this.vaccination.fromTime);
      this.vaccination.toTime = new Date(this.vaccination.toTime);
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
    const val = this.registrationForm.value;

    if (confirm("Willst du dich wirklich zu diesen Impftermin anmelden?")) {
      this.activeUser.vaccination_id = this.vaccination.id;
      this.activeUser.gender = this.selectedGender;
      this.activeUser.firstname = val.firstname;
      this.activeUser.lastname = val.lastname;
      this.activeUser.dateOfBirth = val.dateOfBirth;
      this.activeUser.socialSecurityNumber = val.socialSecurityNumber;
      this.activeUser.phonenumber = val.phonenumber;
      this.activeUser.email = val.email;

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
