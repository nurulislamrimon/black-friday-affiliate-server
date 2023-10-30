declare namespace Express {
  export interface Request {
    user: {
      name: string;
      email: string;
      uid: string;
      picture: string;
      email_verified: boolean;
    };
  }
}
