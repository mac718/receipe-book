import { User as UserDocument } from "../../models/user";

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
