import { Router } from "express";
import * as authController from "../controllers/authController"; // Import controller functions

const router = Router();

router.post("/signup", authController.signup);
router.post('/login', authController.login);

export default router;
    