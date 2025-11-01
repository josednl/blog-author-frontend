export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePicId?: string | null;
  bio?: string | null;
  roleId?: string | null;
  roleName?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
