import { User } from "./user.model";

export class Event {
  _id?: any;
  title?: string;
  creator?: User; // or userid as string?
  description?: string;
  imageURL? : string;
  audioURL? : string;
  category?: string;
  published?: boolean;
  tags?: string[];
}
