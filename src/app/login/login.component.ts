import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../shared/authentication.service";
import { User } from "../shared/user";
import { UserFactory } from "../shared/user-factory";
import { UserService } from "../shared/user.service";

interface Response {
  access_token: string;
}

@Component({
  selector: "c-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  activeUser: User = UserFactory.empty();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required]
    });
  }

  login() {
    const val = this.loginForm.value;
    if (val.username && val.password) {
      this.authService.login(val.username, val.password).subscribe(res => {
        console.log(res);
        this.authService.setLocalStorage((res as Response).access_token);
        this.router.navigateByUrl("/");
      });
    }
  }


  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  logout() {
    this.authService.logout();
  }
}
