export class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public password: string,
    public gender: string,
    public firstname: string,
    public lastname: string,
    public dateOfBirth: Date,
    public socialSecurityNumber: number,
    public phonenumber: number,
    public vaccinated: boolean,
    public isAdmin: boolean,
    public vaccination_id: number
  ) {}
}
