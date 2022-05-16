export interface FacebookUser {
  email: string;
  lastName: string;
  firstName: string;
  facebookId: string;
}

export interface FacebookPayload {
  user: FacebookUser;
  accessToken: string;
}
