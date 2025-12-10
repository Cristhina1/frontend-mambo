export interface Login {
  numeroDocumento: string;
  password: string;
}

export interface Register {
  numeroDocumento: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

