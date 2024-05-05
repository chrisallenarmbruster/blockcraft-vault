import express from "express";
import passport from "passport";
import { User } from "../db/index.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { clientHashedUserId, clientHashedPassword } = req.body;

    if (!clientHashedPassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await User.findByPk(clientHashedUserId);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const reHashedPassword = await bcrypt.hash(clientHashedPassword, 10);
    const newUser = await User.create({ clientHashedUserId, reHashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(400).json(err);
    }
    if (!user) {
      return res.status(404).json(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json(err);
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  try {
    req.logout(() => {
      res.status(200).json({ message: "User logged out" });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/user-session", (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    } else {
      res.status(204).json({ message: "No user session" });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/delete-user", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.clientHashedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.logout((err) => {
      if (err) {
        console.error(err);
        return next(err);
      }

      user
        .destroy()
        .then(() => {
          res.status(200).json({ message: "User account deleted" });
        })
        .catch((error) => {
          console.error(error);
          next(error);
        });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
