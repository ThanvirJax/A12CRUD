import { User } from "./user";

export interface LoginResponse {
  result: string; // 'success' or 'failure'
  message?: string; // Optional message (e.g., 'Invalid credentials')
  user?: User; // Optionally include the user object if the login is successful
}
