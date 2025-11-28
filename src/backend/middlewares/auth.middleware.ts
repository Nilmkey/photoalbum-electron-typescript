import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token.ts";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["Authorization"]) return res.status(401);
  const authHeaders = req.headers["Authorization"]!;
  const authToken = authHeaders.split(" ")[1];
  const decoded = verifyToken(authToken);
  if (!decoded) {
    return res.status(401);
  } else {
    req.user = decoded;
    next();
  }
}
