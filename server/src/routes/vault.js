import express from "express";
import { User } from "../db/index.js";

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "User not authenticated" });
}

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.clientHashedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ encryptedData: user.encryptedData });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing GET /api/vault route";
    next(error);
  }
});

router.put("/", isAuthenticated, async (req, res, next) => {
  if (!req.body.encryptedData) {
    return res.status(400).json({ message: "Encrypted data is required" });
  }
  try {
    const [updated] = await User.update(
      { encryptedData: req.body.encryptedData },
      {
        where: { clientHashedUserId: req.user.clientHashedUserId },
        returning: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Encrypted data updated successfully" });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing PUT /api/vault route";
    next(error);
  }
});

router.delete("/", isAuthenticated, async (req, res, next) => {
  try {
    const [updated] = await User.update(
      { encryptedData: null },
      {
        where: { clientHashedUserId: req.user.clientHashedUserId },
        returning: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json({ message: "Encrypted data deleted successfully" });
  } catch (error) {
    error.status = 500;
    error.comment = "Error processing DEL /api/vault route";
    next(error);
  }
});

export default router;
