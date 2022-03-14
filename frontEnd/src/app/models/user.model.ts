import { UserRole } from "../models/user-role"
export class User {
  id?: any;
  //roles?: UserRole[];
  roles?: String[];
  username?: String;
  email?: String;
  favEvents?: Event[];
}
