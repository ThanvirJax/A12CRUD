export interface LoginResponse {
  result: string;
  message?: string;
  user: {
    user_name: string;
    admin_name: string;
    email: string;
    adminSpecificField?: string;
  };
  role: 'admin' | 'user';
  token: string;
}
