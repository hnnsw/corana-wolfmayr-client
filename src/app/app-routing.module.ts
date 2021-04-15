import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { VaccinationDetailsComponent } from "./vaccination-details/vaccination-details.component";
import { VaccinationListComponent } from "./vaccination-list/vaccination-list.component";
import { VaccinationRegistrationComponent } from "./vaccination-registration/vaccination-registration.component";

const routes: Routes = [
  { path: "", redirectTo: "vaccinations", pathMatch: "full" },
  //{ path: "home", component: HomeComponent },
  { path: "vaccinations", component: VaccinationListComponent },
  { path: "vaccinations/admin/:id", component: VaccinationDetailsComponent },
  { path: "vaccinations/user/:id", component: VaccinationRegistrationComponent },
  { path: "vaccinations/admin/:id/:username", component: UserDetailsComponent },
  { path: "login", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
