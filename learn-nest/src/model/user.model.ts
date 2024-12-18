export class UserRegister {
  name: string;
  username: string;
  password: string;
}

export class RegisterResponse {
  username: string;
  name: string;
  token?: string;
}
