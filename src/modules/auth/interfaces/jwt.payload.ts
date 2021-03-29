export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  phone_number: string;
  iat?: number;
  exp?: number;
  jti?: string;
}
