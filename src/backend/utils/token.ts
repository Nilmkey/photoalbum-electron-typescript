import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret: string | undefined = process.env["JWT_secret"];
if (!secret) {
  throw new Error("no secret key");
}

export interface JWTPayload {
  id: string;
  username: string;
  role?: string;
}

export function generateToken(data: JWTPayload) {
  return jwt.sign(data, secret!, { expiresIn: "30m" });
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, secret!) as JWTPayload;
    return payload;
  } catch (e) {
    console.log(e);
    return false;
  }
}
