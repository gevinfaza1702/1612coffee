import express from "express";
import { register, loginUser, loginAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login-user", loginUser);
router.post("/login-admin", loginAdmin);

export default router;
