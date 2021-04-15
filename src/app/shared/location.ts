import { LocalizedString } from "@angular/compiler";

export class Location {
  constructor(
    public id: number,
    public name: string,
    public zipcode: number,
    public city: string,
    public address: string
  ) {}
}
