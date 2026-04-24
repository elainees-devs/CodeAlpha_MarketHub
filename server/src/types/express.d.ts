import { IAuthUser } from "./interfaces.types";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
      session_id?: string;
    }
  }
}

export {};