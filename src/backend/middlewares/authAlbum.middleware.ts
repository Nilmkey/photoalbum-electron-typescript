import type { NextFunction, Request, Response } from "express";
import authService from "../routes/auth.service.ts";

export default async function authAlbumMidddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const albumId = req.params.id;
  const userId = req.user?.id;
  const album = await authService.oneAlbum(albumId);

  if (!album) return res.status(404).json({ error: "album not found" });
  if (userId != album.userId) {
    console.log("it not your albom!!!");
    return res.status(401);
  } else {
    console.log("ok");
    next();
  }
}
