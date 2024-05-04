import express from "express";
// import routes from "./routes";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "../../client/dist")));

// app.use("/api", routes);

export default app;
