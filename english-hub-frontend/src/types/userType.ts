export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  UNVERIFIED = 'UNVERIFIED',
  DEACTIVATED = 'DEACTIVATED',
}

export type UserResponse = {
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

export type UserUpdateRequest = {
  username: string;
  email: string;
  role: UserRole;
};
