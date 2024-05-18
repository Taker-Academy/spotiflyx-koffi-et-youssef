import express, { Router } from "express";
import cors from "cors";
import authRoutes from "./app/auth/auth";
import homeRoutes from "./app/home/home";

const app = express();
const router: Router = express.Router();

app.use(express.json());
app.use(cors());
app.use("/", router);
app.use(authRoutes);
app.use(homeRoutes);

const PORT: string | number = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
