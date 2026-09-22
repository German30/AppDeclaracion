export interface RegistroRequest {
  email: string;
  password: string;
  nombre: string;
  rfc: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

/** Claims read out of the JWT payload (sub/email/jti — see JwtTokenService on the backend). */
export interface JwtClaims {
  sub: string;
  email: string;
  jti: string;
  exp: number;
  iss?: string;
  aud?: string;
}

export interface SesionUsuario {
  usuarioId: string;
  email: string;
  expiraEn: Date;
}
