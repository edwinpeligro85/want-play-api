export interface Environment {
  production: boolean;
  database: DataBaseEnvironment;
}

export interface DataBaseEnvironment {
  host: string;
  name: string;
  username: string;
  password: string;
}
