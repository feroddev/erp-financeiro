export interface JwtPayload {
  email: string;
  sub: string;
  username: string;
}

export interface JwtUser {
  userId: string;
  email: string;
  username: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export interface RequestWithUser extends Request {
  user: UserWithoutPassword;
}
