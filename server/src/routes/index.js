import express from "express";
import auth from "./auth.js";
import vault from "./vault.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/vault", vault);

export default router;
