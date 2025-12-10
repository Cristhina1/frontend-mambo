export interface Login {
  dni: string;
  password: string;
}

export interface Register {
  dni: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

