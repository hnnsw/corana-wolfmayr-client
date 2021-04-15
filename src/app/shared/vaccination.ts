import { User } from "./user";
import { Location } from "./location";
export { User } from "./user";
export { Location } from "./location";

export class Vaccination {
  constructor(
    public id: number,
    public dateOfVaccination: Date,
    public fromTime: Date,
    public toTime: Date,
    public maxParticipants: number,
    public users: User[],
    public location: Location,
    public location_id: number
  ) {}
}
