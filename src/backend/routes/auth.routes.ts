import { Router, type Request, type Response } from "express";
import authController from "./auth.controller.ts";
import upload from "../utils/storageMulter.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import authAlbumMidddleware from "../middlewares/authAlbum.middleware.ts";

const router: Router = Router();

router.get("/get-photo", (_req: Request, res: Response) => {
  console.log("fdfd");
  res.status(200).json({ message: "alo alo" });
});

//auth
router.post("/register", authController.regUser);
router.post("/login", authController.loginUser);

//cooikes
// router.get("/verify-token", authController.verifyToken);

//albums
router.post(
  "/create-album",
  authMiddleware,
  upload.single("cover"),
  authController.createAlbum
);
router.get("/album:id", authController.getAlbum);
router.post(
  "/album/:id/add-photos",
  authMiddleware,
  authAlbumMidddleware,
  upload.array("file", 100),
  authController.addPhototoAlbum
);
router.get("/albums", authController.getAlbums);
router.delete(
  "/album/:id/remove-album",
  authMiddleware,
  authAlbumMidddleware,
  authController.removeAlbum
);

export default router;
