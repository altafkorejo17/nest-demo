export interface User {
  id: string;
  email: string;
}

export interface UserRecord extends User {
  passwordHash: string;
}

// Types `@CurrentUser()` across the app.
declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: User;
  }
}
