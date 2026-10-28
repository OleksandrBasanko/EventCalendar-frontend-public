export interface RegisterRequest {
  userName: string;
  email: string;
  phone: string;
  firstName: string;
  secondName: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface DecodedToken {
  sub?: string;
  email?: string;
  role?: string;
  firstName?: string;
  secondName?: string;
  exp?: number;
  [key: string]: any;
}
