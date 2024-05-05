import express from "express";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import passport from "passport";
import { sequelize } from "./db/index.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import routes from "./routes/index.js";
import "./routes/passportConfig.js";

const app = express();

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

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

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
