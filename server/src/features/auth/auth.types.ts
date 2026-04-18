export interface CreateUserDTO {
  email: string;
  password: string;
  userName: string;
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}
