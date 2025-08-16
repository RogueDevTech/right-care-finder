declare module "passport-jwt" {
  import { Request } from "express";

  export interface StrategyOptions {
    jwtFromRequest: (req: Request) => string | null;
    secretOrKey: string;
    ignoreExpiration?: boolean;
  }

  export class Strategy {
    constructor(
      options: StrategyOptions,
      verify: (payload: any, done: (error: any, user?: any) => void) => void,
    );
  }

  export class ExtractJwt {
    static fromAuthHeaderAsBearerToken(): (req: Request) => string | null;
  }
}
