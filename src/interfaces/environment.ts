export interface Environment {
  port: number;
  apiPrefix: string;
  production: boolean;
  jwtSecret: string;
  clientAppUrl: string;
  database: DataBaseEnvironment;
  mailer: MailerEnvironment;
  appUrl: string;
  assets: string;
  auth: AuthEnvironment;
}

export interface DataBaseEnvironment {
  host: string;
  name: string;
  username: string;
  password: string;
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
