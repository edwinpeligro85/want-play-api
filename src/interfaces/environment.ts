export interface Environment {
  jwt: JwtEnvironment;
  port: number;
  auth: AuthEnvironment;
  appUrl: string;
  assets: string;
  mailer: MailerEnvironment;
  database: DataBaseEnvironment;
  apiPrefix: string;
  production: boolean;
  clientAppUrl: string;
}

export interface DataBaseEnvironment {
  host: string;
  name: string;
  username: string;
  password: string;
}

export interface JwtEnvironment {
  access: JwtTokenValues;
  refresh: JwtTokenValues;
}

interface JwtTokenValues {
  secret: string;
  expirationTime: string;
}

export interface MailerEnvironment {
  host: string;
  port: number;
  user: string;
  password: string;
  fromName: string;
  fromEmail: string;
}

export interface AuthEnvironment {
  fb: AuthFacebookEnvironment;
}

export interface AuthFacebookEnvironment {
  id: number;
  secret: string;
}
