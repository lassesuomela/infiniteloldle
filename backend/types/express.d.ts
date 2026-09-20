import "express";

declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

export {};
