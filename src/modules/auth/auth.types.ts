/* eslint-disable camelcase */

export type UserData = {
  displayName: string;
  email: string;
  password: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  verified?: boolean;
  verificationToken?: string;
  googleId?: string;
  facebookId?: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  expiry: number;
};

export type ResponseUser = {
  googleId: string | null;
  email: string;
  id: number;
  displayName: string;
  facebookId: string | null;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiry: number;
  user: ResponseUser;
};

export type RequestDataForGoogleLogin = {
  googleId: string;
  imageUrl: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  tokenId: string;
};

export type RequestDataForFacebookLogin = {
  accessToken: string;
  data_access_expiration_time: number;
  email: string;
  expiresIn: number;
  graphDomain: 'facebook';
  id: string;
  name: string;
  signedRequest: string;
  userID: string;
};

export interface ISocialAccountLogin<T> {
  login: (data: T) => Promise<LoginResponse>;
}

export type scope = 'email' | 'public_profile';

export type DataFromFacebookGraphApi = {
  app_id: string;
  type: 'USER';
  application: string;
  data_access_expires_at: number;
  expires_at: number;
  is_valid: boolean;
  scopes: scope | scope[];
  user_id: string;
};

export type FacebookError = {
  message: string;
  type: string;
  code: number;
  fbtrace_id: string;
};

export interface IResponseBodyFromGraphApi {
  data: DataFromFacebookGraphApi;
  error: FacebookError;
}

export type ChangePasswordData = {
  id: number;
  oldPassword: string;
  newPassword: string;
};

export type ResetPassword = {
  email: string;
};

export type setNewPassWordData = {
  password: string;
  token: string;
};
