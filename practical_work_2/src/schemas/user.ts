import Backendless from "backendless";
import type { Gender } from "./gender";
import type { Country } from "./country";

export type User = Backendless.User & {
  login: string;
  dateOfBirth: Date;
  gender: Gender;
  country: Country;
  avatar: string;
};

export type UserToRegister = Required<
  Pick<
    User,
    "email" | "password" | "login" | "dateOfBirth" | "gender" | "country"
  >
>;

export type UserToLogin = Required<Pick<User, "email" | "password">>;

export type AuthUserData = Pick<User, "email" | "password">;
export type PublicUserData = Pick<
  User,
  "login" | "gender" | "country" | "avatar"
>;
