import express from "express";
import loginRoutes from "./login";
import registerRoutes from "./register";

const router = express.Router();

router.use(loginRoutes);
router.use(registerRoutes);

export default router;
