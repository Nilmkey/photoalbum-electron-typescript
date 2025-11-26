import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers["authorization"]) return res.status(401);
  const authHeaders = req.headers["authorization"]!;
  const authToken = authHeaders.split(" ")[1];
  const decoded = verifyToken(authToken);
  if (!decoded) {
    return res.status(401);
  } else {
    req.user = decoded;
    next();
  }
}
