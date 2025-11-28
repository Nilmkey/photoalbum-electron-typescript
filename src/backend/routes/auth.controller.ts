import authService from "./auth.service.ts";
import { type Request, type Response } from "express";
import { type IUser } from "./models/user.model.ts";
import bcrypt from "bcrypt";
import { generateToken, type JWTPayload } from "../utils/token.ts";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../utils/token.ts";
import type { IAlbum } from "./models/album.model.ts";

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
          return res.status(400).json({ messageError: "password not correct" });
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
      //fff
    }
  }

  async createAlbum(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: "user not auth" });
    if (!req.body) return res.status(400).json({ error: "no req body" });
    if (!req.file) return res.status(401).json({ error: "not found photos" });
    const { path } = req.file;
    const body = req.body;
    const userId = req.user?.id;
    const usernameAuthor = req.user?.username;
    const room = body.room;
    const category = ["Memes", "City", "Travel", "Nature", "Gaming", "Another"];
    if (!category.includes(room))
      return res.status(401).json({ error: "unacceptable room" });
    const dataAlbum = {
      id: "ALBUM-" + uuidv4(),
      userId: userId,
      title: body.title,
      room: body.room,
      cover: path,
      author: usernameAuthor,
      description: body.description,
      photos: body.photos,
    } as IAlbum;
    try {
      const createdAlbum = await authService.newAlbum(dataAlbum);
      console.log(createdAlbum);
      return res.status(200).json(createdAlbum);
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  async getAlbum(req: Request, res: Response) {
    if (!req.params.id)
      return res.status(404).json({ error: "id not received" });
    const idAlbum: string = req.params.id;
    try {
      const album = await authService.oneAlbum(idAlbum);
      return res.status(200).json(album);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async addPhototoAlbum(req: Request, res: Response) {
    if (!req.params.id)
      return res.status(404).json({ error: "id not received" });
    if (!req.files)
      return res.status(403).json({ error: "files not received" });
    const files = req.files as Express.Multer.File[];
    const idAlbum: string = req.params.id;
    const pathsArray: string[] = files.map((file) => file.path);
    try {
      const uploadPhotos = await authService.addPhoto(idAlbum, pathsArray);
      return res.status(200).json(uploadPhotos);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async removeAlbum(req: Request, res: Response) {
    if (!req.params.id)
      return res.status(404).json({ error: "id not received" });
    try {
      const albumId = req.params.id;
      const delAlbum = await authService.removeAlbum(albumId);
      return res.status(200).json(delAlbum);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  async getAlbums(req: Request, res: Response) {
    if (!req.query) {
      try {
        const arrayAlbums = await authService.getAllAlbum();
        return res.status(200).json(arrayAlbums);
      } catch (e) {
        return res.status(500).json({ error: e });
      }
    } else {
      const queries = req.query;
      if (!queries.room) return res.status(401);
      const room: string = queries.room as string;

      try {
        const roomAlbums = await authService.getRoomAlbum(room);
        return res.status(200).json(roomAlbums);
      } catch (e) {
        return res.status(500).json(e);
      }
    }
  }
}

export default new AuthController();
