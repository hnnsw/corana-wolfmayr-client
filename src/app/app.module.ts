import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { VaccinationService } from "./shared/vaccination.service";
import { VaccinationListComponent } from "./vaccination-list/vaccination-list.component";
import { VaccinationListItemComponent } from "./vaccination-list-item/vaccination-list-item.component";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { VaccinationDetailsComponent } from "./vaccination-details/vaccination-details.component";
import { UserListItemComponent } from "./user-list-item/user-list-item.component";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { DatePipe, registerLocaleData } from "@angular/common";
import { UserService } from "./shared/user.service";
import { LocationService } from "./shared/location.service";
import { LOCALE_ID, NgModule } from "@angular/core";
import { AuthenticationService } from "./shared/authentication.service";
import { LoginComponent } from "./login/login.component";
import { TokenInterceptorService } from "./shared/token-interceptor.service";
import { JwtInterceptorService } from "./shared/jwt-interceptor.service";
import { VaccinationRegistrationComponent } from "./vaccination-registration/vaccination-registration.component";
import localeDe from "@angular/common/locales/de";

registerLocaleData(localeDe);

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  declarations: [
    AppComponent,
    VaccinationListComponent,
    VaccinationListItemComponent,
    VaccinationDetailsComponent,
    UserListItemComponent,
    UserDetailsComponent,
    LoginComponent,
    VaccinationRegistrationComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    VaccinationService,
    DatePipe,
    UserService,
    LocationService,
    AuthenticationService,
    TokenInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: "de"
    }
  ]
})
export class AppModule {}
