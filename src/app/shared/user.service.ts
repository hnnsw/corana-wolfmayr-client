import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { User } from "./user";

@Injectable()
export class UserService {
  private api = "https://corana.s1810456040.student.kwmhgb.at/api";

  constructor(private http: HttpClient) {}

  getAllUsers(username: string): Observable<User> {
    return this.http
      .get<User>(`${this.api}/user/${username}`)
      .pipe(retry(3))
      .pipe(catchError(this.errorHandler));
  }

  getSingleUser(username: string): Observable<User> {
    return this.http
      .get<User>(`${this.api}/users/${username}`)
      .pipe(retry(3))
      .pipe(catchError(this.errorHandler));
  }

  getSingleUserById(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.api}/users/id/${id}`)
      .pipe(retry(3))
      .pipe(catchError(this.errorHandler));
  }

  saveUser(user: User): Observable<any> {
    return this.http
      .put(`${this.api}/user/${user.username}`, user)
      .pipe(retry(3))
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: Error | any) {
    return throwError(error);
  }
}
