import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { User } from "../shared/user";
import { UserFactory } from "../shared/user-factory";
import { UserService } from "../shared/user.service";

@Component({
  selector: "c-user-details",
  templateUrl: "./user-details.component.html"
})
export class UserDetailsComponent implements OnInit {
  user: User = UserFactory.empty();

  constructor(
    private us: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.us.getSingleUser(params["username"]).subscribe(res => {
      this.user = res;
    });
  }

  //change vaccination details for user - add vaccination + remove vaccination (just for accidental changes) functionality
  saveUser() {
    if (confirm("Wollen sie diese Änderung wirklich vornehmen?")) {
      this.us.saveUser(this.user).subscribe(res => {
        this.toastr.info(
          "Impfdetails wurden aktualisiert",
          "Impfdetails aktualisiert!"
        );
      });
    }
  }
}
