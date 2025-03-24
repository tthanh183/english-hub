export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  UNVERIFIED = 'UNVERIFIED',
  DEACTIVATED = 'DEACTIVATED',
}

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinDate: Date;
};

export type UserCreateRequest = {
  username: string;
  email: string;
  role: UserRole;
};
