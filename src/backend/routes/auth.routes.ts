import { Router, type Request, type Response } from "express";
import authController from "./auth.controller.ts";
import upload from "../utils/storageMulter.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const router: Router = Router();

router.get("/get-photo", (_req: Request, res: Response) => {
  console.log("fdfd");
  res.status(200).json({ message: "alo alo" });
});

//auth
router.post("/register", authController.regUser);
router.post("/login", authController.loginUser);

//cooikes
router.get("/verify-token", authController.verifyToken);
router.post("/create-album", authMiddleware, authController.createAlbum);
router.post("/upload", upload.single("file"), authController.postPhoto);

export default router;
