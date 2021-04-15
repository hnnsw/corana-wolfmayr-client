import { Vaccination } from "./vaccination";

export class VaccinationFactory {
  static empty(): Vaccination {
    return new Vaccination(
      null,
      new Date(),
      new Date(),
      new Date(),
      0,
      [
        {
          id: 0,
          username: "",
          email: "",
          password: "",
          gender: "",
          firstname: "",
          lastname: "",
          dateOfBirth: new Date(),
          socialSecurityNumber: 0,
          phonenumber: 0,
          vaccinated: false,
          isAdmin: false,
          vaccination_id: 0
        }
      ],
      { id: 0, name: "", zipcode: 0, city: "", address: "" },
      null
    );
  }

  static fromObject(rawVaccination: any): Vaccination {
    return new Vaccination(
      rawVaccination.id,
      typeof rawVaccination.dateOfVaccination === "string"
        ? new Date(rawVaccination.dateOfVaccination)
        : rawVaccination.dateOfVaccination,
      typeof rawVaccination.fromTime === "string"
        ? new Date(rawVaccination.fromTime)
        : rawVaccination.fromTime,
      typeof rawVaccination.toTime === "string"
        ? new Date(rawVaccination.toTime)
        : rawVaccination.toTime,
      rawVaccination.maxParticipants,
      rawVaccination.users,
      rawVaccination.location,
      rawVaccination.location_id
    );
  }
}
