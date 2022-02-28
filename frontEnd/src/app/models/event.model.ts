import { User } from "./user.model";

export class Event {
  id?: any;
  title?: string;
  creator?: User; // or userid as string?
  description?: string;
  imageURL? : string;
  published?: boolean;
}
