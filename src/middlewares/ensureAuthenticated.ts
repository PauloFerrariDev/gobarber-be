import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "src/config/auth";

import AppError from "src/errors/AppError";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  // JWT token validation

  const atuhHeader = request.headers.authorization;

  if (!atuhHeader) {
    throw new AppError("JWT token is missing", 401);
  }

  const [, token] = atuhHeader.split(" ");

  const { secret } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError("Invalid JWT token", 401);
  }
}
