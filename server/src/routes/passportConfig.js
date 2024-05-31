import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "../db/index.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "clientHashedUserId",
      passwordField: "clientHashedPassword",
    },
    async (clientHashedUserId, clientHashedPassword, done) => {
      try {
        const user = await User.findOne({ where: { clientHashedUserId } });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isValid = await bcrypt.compare(
          clientHashedPassword,
          user.reHashedPassword
        );

        if (!isValid) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.clientHashedUserId);
});

passport.deserializeUser(async (clientHashedUserId, done) => {
  try {
    const user = await User.findByPk(clientHashedUserId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
