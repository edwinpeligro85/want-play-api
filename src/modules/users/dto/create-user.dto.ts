import { Status } from "../enums";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  status?: Status;
}
