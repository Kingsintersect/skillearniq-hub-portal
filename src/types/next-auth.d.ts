import "next-auth"
import "next-auth/jwt"
import { UserInterface } from "@/types/global"

declare module "next-auth" {
  interface User extends UserInterface {
    access_token: string
    expires_in: number
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserInterface
    access_token: string
    expires_in: number
  }
}

declare module "next-auth/providers" {
  interface CredentialsInput {
    email: string;
    password: string;
  }
}