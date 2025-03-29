export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export type VerifyRequest = {
  email: string;
  verificationCode: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};
