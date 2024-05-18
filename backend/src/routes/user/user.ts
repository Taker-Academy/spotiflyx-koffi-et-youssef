import express from "express";
import modifyPasswordRoutes from "./modifyPassword";
import deleteRoutes from "./delete";

const router = express.Router();

router.use(modifyPasswordRoutes);
router.use(deleteRoutes);

export default router;
