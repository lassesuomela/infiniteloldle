import type { NextFunction, Request } from "express";
import type { ApiResponseWriter } from "../types/api";

const token = (
  req: Request,
  res: ApiResponseWriter<never>,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.json({
      status: "error",
      message: "No authorization header found",
    });
  }

  if (authorization.split(" ").length !== 2) {
    return res.json({
      status: "error",
      message: "Malformed authorization header",
    });
  }
  const tokenValue = authorization.split(" ")[1];
  if (!tokenValue || tokenValue.length < 10) {
    return res.json({ status: "error", message: "Token is required" });
  }

  req.token = tokenValue;
  next();
};

module.exports = token;
