import { Session, User } from "next-auth";

import { IProgressData } from "@/app/lib/types/IProgress";

export interface ISessionExtended extends Session {
  user: IUserExtended;
}

export interface IUserExtended extends User {
  progress: IProgressData;
}
