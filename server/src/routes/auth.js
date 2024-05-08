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
    error.status = 500;
    error.comment = "Error processing POST /api/auth/register route";
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      error.status = 400;
      error.comment = "Error processing POST /api/auth/login route";
      return next(error);
    }
    if (!user) {
      const err = new Error(info.message);
      err.status = 404;
      err.comment = "Authentication failed in POST /api/auth/login route";
      return next(err);
    }
    req.logIn(user, (error) => {
      if (error) {
        error.status = 400;
        error.comment = "Bad request in POST /api/auth/login route";
        return next(error);
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
    error.status = 500;
    error.comment = "Error processing POST /api/auth/logout route";
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
    error.status = 500;
    error.comment = "Error processing GET /api/auth/user-session route";
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

    req.logout((error) => {
      if (error) {
        console.error(error);
        return next(error);
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
    error.status = 500;
    error.comment = "Error processing DEL /api/auth/delete-user route";
    next(error);
  }
});

export default router;
