import { User } from "./user";

export class UserFactory {
  static empty(): User {
    return new User(
      0,
      "",
      "",
      "",
      "",
      "",
      "",
      new Date(),
      0,
      0,
      false,
      false,
      0
    );
  }

  static fromObject(rawUser: any): User {
    return new User(
      rawUser.id,
      rawUser.username,
      rawUser.email,
      rawUser.password,
      rawUser.gender,
      rawUser.firstname,
      rawUser.lastname,
      typeof rawUser.dateOfBirth === "string"
        ? new Date(rawUser.dateOfBirth)
        : rawUser.dateOfBirth,
      rawUser.socialSecurityNumber,
      rawUser.phonenumber,
      rawUser.vaccinated,
      rawUser.isAdmin,
      rawUser.vaccination_id
    );
  }
}
