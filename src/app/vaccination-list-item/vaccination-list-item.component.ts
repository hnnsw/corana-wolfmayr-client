import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { AuthenticationService } from "../shared/authentication.service";
import { UserFactory } from "../shared/user-factory";
import { UserService } from "../shared/user.service";
import { User, Vaccination } from "../shared/vaccination";

@Component({
  selector: "tr.c-vaccination-list-item",
  templateUrl: "./vaccination-list-item.component.html"
})
export class VaccinationListItemComponent implements OnInit {
  @Input() vaccination: Vaccination;

  vaccinationPassed: boolean;
  activeUser: User = UserFactory.empty();

  constructor(
    public datepipe: DatePipe,
    public authService: AuthenticationService,
    private us: UserService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.us
        .getSingleUserById(this.authService.getCurrentUserId())
        .subscribe(res => {
          this.activeUser = res;
        });
    }

    if (
      this.datepipe.transform(
        this.vaccination.dateOfVaccination,
        "yyyy-MM-dd"
      ) >= this.datepipe.transform(new Date(), "yyyy-MM-dd")
    ) {
      this.vaccinationPassed = true;
    } else {
      this.vaccinationPassed = false;
    }
  }
}
