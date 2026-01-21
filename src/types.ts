export type JwtUser = {
    id: number;
    email: string;
  };
  
  declare global {
    namespace Express {
      interface Request {
        user?: JwtUser;
      }
    }
  }
  