import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Location } from "./location";

@Injectable()
export class LocationService {
  private api = "https://corana.s1810456040.student.kwmhgb.at/api";

  constructor(private http: HttpClient) {}

  saveLocation(location: Location): Observable<any> {
    return this.http
      .put(`${this.api}/location/${location.id}`, location)
      .pipe(retry(3))
      .pipe(catchError(this.errorHandler));
  }

  getAllLocations(): Observable<Location> {
    return this.http
      .get<Location>(`${this.api}/locations`)
      .pipe(retry(3))
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any) {
    return throwError(error);
  }
}
