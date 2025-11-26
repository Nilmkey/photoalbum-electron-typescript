import authService from "./auth.service.ts";
import { type Request, type Response } from "express";
import { type IUser } from "./models/user.model.ts";
import bcrypt from "bcrypt";
import { generateToken, type JWTPayload } from "../utils/token.ts";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../utils/token.ts";

class AuthController {
  async regUser(req: Request, res: Response) {
    const body = req.body;
    if (!body) throw new Error("alo body is empty");

    const hashedPassword: string = await bcrypt.hash(body.password, 10);

    const data = {
      id: "USER-" + uuidv4(),
      username: body.username as string,
      password: hashedPassword,
    } as IUser;

    try {
      const createdUser = await authService.registerUser(data);
      res.status(200).json(createdUser);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async loginUser(req: Request, res: Response) {
    const body = req.body;
    console.log(body);
    const authorizationData = {
      username: body.username as string,
      password: body.password as string,
    } as IUser;

    try {
      const authorizationUser = await authService.loginUser_db(
        authorizationData
      );
      if (!authorizationUser) {
        return res.status(404).json({ message: "user not found" });
      } else {
        const isLogin: boolean = await bcrypt.compare(
          authorizationData.password,
          authorizationUser.password
        );
        if (!isLogin) {
          return res.status(401).json({ messageError: "password not correct" });
        }
        const data: JWTPayload = {
          id: authorizationUser.id,
          username: authorizationUser.username,
        };

        const JWTtoken = generateToken(data);
        return res
          .status(200)
          .json({ JWTtoken: JWTtoken, expiredIn: 60 * 60 * 0.5 });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async verifyToken(req: Request, res: Response) {
    if (!req.headers["authorization"]) return res.status(401);
    const authHeaders: string = req.headers["authorization"];
    const authToken: string = authHeaders.split(" ")[1];
    const decoded = verifyToken(authToken);
    if (!decoded) {
      return res.status(401);
    } else {
      return res.status(200).json({ decoded });
    }
  }

  async getCookies(req: Request, res: Response) {
    try {
      const sssCokie = req.cookies["sss"];
      console.log(sssCokie);
      res.status(200).json(sssCokie);
    } catch (e) {
      res.status(500).json("cookie error" + e);
    }
  }

  // async createAlbum(req:Request, res: Response){
  //   try{

  //   }
  // }

  async postPhoto(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: "youre not logined" });
    if (!req.file) return res.status(403).json({ message: "no found photo" });
    const { path, filename } = req.file;
    //находим альбом и обновляем его массив photos новым путем
    return res
      .status(200)
      .json({
        message: "photo has uploaded",
        path: "photo path: " + path,
        filename: "photo filename: " + filename,
      });
  }
}

export default new AuthController();
