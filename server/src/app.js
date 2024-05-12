import express from "express";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import passport from "passport";
import { sequelize } from "./db/index.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import routes from "./routes/index.js";
import "./routes/passportConfig.js";
import cors from "cors";

const app = express();

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, "../../client/dist")));

app.use("/api", routes);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.log("error handler");
  console.error(error);
  if (!error.status) {
    error.status = 500;
  }
  res.status(error.status).json({
    status: error.status,
    message: error.message,
    name: error.name,
    comment: error.comment,
  });
});

export default app;
