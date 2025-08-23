import { ISession } from "@/interfaces";
import { SessionOptions } from "iron-session";

export const defaultSession: ISession = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.NEXT_PUBLIC_SECRET_KEY || "",
  cookieName: "..",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_ENVIRONMENT === "production",
  },
};
