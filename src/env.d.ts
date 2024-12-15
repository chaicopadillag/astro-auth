interface AuthUser {
  name: string;
  avatar: string;
  email: string;
  id: string;
  emailVerified: boolean;
  provider: string;
}

declare namespace App {
  interface Locals {
    authUser: AuthUser | null;
    isLogged;
  }
}
