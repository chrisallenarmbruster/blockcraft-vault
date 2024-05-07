# README.md

# blockcraft-vault

Blockcraft Vault is my app for keeping private information such as encryption keys secure, private and anonymous through the use of a zero-knowledge encryption scheme. The server never sees or stores your unhashed user id and password, or your unencrypted data. Moreover, the hashed password will not decrypt the data. It is ideal for such use cases as a blockchain wallet, blockchain voting ballot and beyond.


# client/README.md

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# client/package.json

```json
{
  "name": "blockcraft-vault-client",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint 'src/**/*.{js,jsx}' --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.3",
    "bootstrap": "^5.3.3",
    "dotenv": "^16.4.5",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.2",
    "react-dom": "^18.2.0",
    "react-icons": "^5.2.0",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.23.0",
    "redux": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0"
  }
}

```

# client/src/Components/App.jsx

```javascript
import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

```

# client/src/main.jsx

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

```

# client/src/store/index.js

```javascript
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {},
});

export default store;

```

# client/vite.config.js

```javascript
/* global process */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../server/.env") });

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

```

# genSourceCode.js

```javascript
/*
  File: genSourceCode.js
  Description: This script generates a markdown file that includes all the source code of the application. It recursively finds all .js, .jsx, README.md, and package.json files in the project directory, excluding the node_modules, dist, and public directories. For each file found, it determines the language based on the file extension, reads the file content, and appends it to the markdown file with appropriate markdown formatting. The markdown file is saved in the same directory as this script.
*/

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, "vaultSourceCode.md");

async function findFiles(dir, filelist = []) {
  const excludeDirs = ["node_modules", "dist", "public"];

  if (excludeDirs.some((excludeDir) => dir.includes(excludeDir))) {
    return filelist;
  }

  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await findFiles(filePath, filelist);
    } else if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".jsx") ||
      ["README.md", "package.json"].includes(file.name)
    ) {
      filelist.push(filePath);
    }
  }
  return filelist;
}

function determineLanguage(file) {
  if (file.endsWith(".md")) return "markdown";
  if (file.endsWith(".json")) return "json";
  if (file.endsWith(".js") || file.endsWith(".jsx")) return "javascript";
  return "plaintext";
}

async function appendFileContent(file, language) {
  try {
    const data = await fs.readFile(file, "utf8");
    const relativeFilePath = path.relative(__dirname, file);
    await fs.appendFile(
      outputFile,
      `# ${relativeFilePath}\n\n${
        language !== "markdown"
          ? `\`\`\`${language}\n${data}\n\`\`\`\n\n`
          : `${data}\n\n`
      }`
    );
    console.log(`Appended contents of ${relativeFilePath} to ${outputFile}`);
  } catch (err) {
    console.error(`Error processing file ${file}:`, err);
  }
}

async function processFiles() {
  try {
    await fs.writeFile(outputFile, "");

    const targetedDirs = [__dirname, path.join(__dirname, ".")];
    let files = [];
    for (const dir of targetedDirs) {
      const foundFiles = await findFiles(dir);
      files = files.concat(foundFiles);
    }

    for (const file of files) {
      const language = determineLanguage(file);
      await appendFileContent(file, language);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

processFiles();

```

# package.json

```json
{
  "name": "blockcraft-vault",
  "version": "0.1.0",
  "type": "module",
  "description": "\"Blockcraft-Vault is a secure, private, and anonymous application designed to store encryption keys and sensitive information using zero-knowledge encryption schemes. Ideal for blockchain wallets, voting systems, and other applications requiring high-security data management, this app ensures that sensitive data remains encrypted and the server never accesses unhashed user IDs, passwords, or data directly. Built on a PERN stack (PostgreSQL, Express, React, Node.js), this project leverages Redux for state management and Vite for building the front-end efficiently.\"",
  "main": "server/src/index.js",
  "scripts": {
    "build": "npm run build:client",
    "build:client": "cd client && npm run build",
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "lint": "concurrently \"npm run lint:client\" \"npm run lint:server\"",
    "lint:client": "cd client && npm run lint",
    "lint:server": "cd server && npm run lint",
    "test": "concurrently \"npm run test:client\" \"npm run test:server\"",
    "test:client": "cd client && npm run test",
    "test:server": "cd server && npm run test",
    "prod": "npm run build:client && cd server && npm run prod"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chrisallenarmbruster/blockcraft-vault.git"
  },
  "keywords": [
    "blockchain",
    "wallet"
  ],
  "author": "Chris Armbruster",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/chrisallenarmbruster/blockcraft-vault/issues"
  },
  "homepage": "https://github.com/chrisallenarmbruster/blockcraft-vault#readme",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}

```

# server/eslint.config.js

```javascript
import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Add your rules here
    },
  },
];

```

# server/package.json

```json
{
  "name": "blockcraft-vault-server",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "prod": "NODE_ENV=production node src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint"
  },
  "devDependencies": {
    "@eslint/js": "^9.2.0",
    "eslint": "^9.2.0",
    "globals": "^15.1.0",
    "nodemon": "^3.1.0"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "connect-session-sequelize": "^7.1.7",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "pg": "^8.11.5",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.3"
  }
}

```

# server/src/app.js

```javascript
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

```

# server/src/db/index.js

```javascript
import Sequelize from "sequelize";
import UserModel from "./models/User.js";

import dotenv from "dotenv";
dotenv.config();

const config = { dialect: "postgres", protocol: "postgres", logging: false };

const sequelize = new Sequelize(process.env.DATABASE_URL, config);

const User = UserModel(sequelize, Sequelize.DataTypes);

async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

async function syncModels() {
  await sequelize.sync({ force: true });
  console.log("All database models were synchronized successfully.");
}

export { User, checkConnection, syncModels, sequelize };

```

# server/src/db/models/User.js

```javascript
import { Model } from "sequelize";

class User extends Model {}

const UserModel = (sequelize, DataTypes) => {
  User.init(
    {
      clientHashedUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      reHashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      encryptedData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

export default UserModel;

```

# server/src/index.js

```javascript
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

async function setUpDatabase() {
  try {
    const { checkConnection, syncModels } = await import("./db/index.js");
    await checkConnection();
    await syncModels();
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
}

async function startApp() {
  try {
    await setUpDatabase();
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the app:", error);
  }
}

startApp();

```

# server/src/routes/auth.js

```javascript
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

```

# server/src/routes/index.js

```javascript
import express from "express";
import auth from "./auth.js";
import vault from "./vault.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/vault", vault);

export default router;

```

# server/src/routes/passportConfig.js

```javascript
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
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

```

# server/src/routes/vault.js

```javascript
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

```

# README.md

# blockcraft-vault

Blockcraft Vault is my app for keeping private information such as encryption keys secure, private and anonymous through the use of a zero-knowledge encryption scheme. The server never sees or stores your unhashed user id and password, or your unencrypted data. Moreover, the hashed password will not decrypt the data. It is ideal for such use cases as a blockchain wallet, blockchain voting ballot and beyond.


# client/README.md

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# client/package.json

```json
{
  "name": "blockcraft-vault-client",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint 'src/**/*.{js,jsx}' --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.2.3",
    "bootstrap": "^5.3.3",
    "dotenv": "^16.4.5",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.2",
    "react-dom": "^18.2.0",
    "react-icons": "^5.2.0",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.23.0",
    "redux": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0"
  }
}

```

# client/src/Components/App.jsx

```javascript
import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

```

# client/src/main.jsx

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

```

# client/src/store/index.js

```javascript
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {},
});

export default store;

```

# client/vite.config.js

```javascript
/* global process */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../server/.env") });

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

```

# genSourceCode.js

```javascript
/*
  File: genSourceCode.js
  Description: This script generates a markdown file that includes all the source code of the application. It recursively finds all .js, .jsx, README.md, and package.json files in the project directory, excluding the node_modules, dist, and public directories. For each file found, it determines the language based on the file extension, reads the file content, and appends it to the markdown file with appropriate markdown formatting. The markdown file is saved in the same directory as this script.
*/

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFile = path.join(__dirname, "vaultSourceCode.md");

async function findFiles(dir, filelist = []) {
  const excludeDirs = ["node_modules", "dist", "public"];

  if (excludeDirs.some((excludeDir) => dir.includes(excludeDir))) {
    return filelist;
  }

  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await findFiles(filePath, filelist);
    } else if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".jsx") ||
      ["README.md", "package.json"].includes(file.name)
    ) {
      filelist.push(filePath);
    }
  }
  return filelist;
}

function determineLanguage(file) {
  if (file.endsWith(".md")) return "markdown";
  if (file.endsWith(".json")) return "json";
  if (file.endsWith(".js") || file.endsWith(".jsx")) return "javascript";
  return "plaintext";
}

async function appendFileContent(file, language) {
  try {
    const data = await fs.readFile(file, "utf8");
    const relativeFilePath = path.relative(__dirname, file);
    await fs.appendFile(
      outputFile,
      `# ${relativeFilePath}\n\n${
        language !== "markdown"
          ? `\`\`\`${language}\n${data}\n\`\`\`\n\n`
          : `${data}\n\n`
      }`
    );
    console.log(`Appended contents of ${relativeFilePath} to ${outputFile}`);
  } catch (err) {
    console.error(`Error processing file ${file}:`, err);
  }
}

async function processFiles() {
  try {
    await fs.writeFile(outputFile, "");

    const targetedDirs = [__dirname, path.join(__dirname, ".")];
    let files = [];
    for (const dir of targetedDirs) {
      const foundFiles = await findFiles(dir);
      files = files.concat(foundFiles);
    }

    for (const file of files) {
      const language = determineLanguage(file);
      await appendFileContent(file, language);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

processFiles();

```

# package.json

```json
{
  "name": "blockcraft-vault",
  "version": "0.1.0",
  "type": "module",
  "description": "\"Blockcraft-Vault is a secure, private, and anonymous application designed to store encryption keys and sensitive information using zero-knowledge encryption schemes. Ideal for blockchain wallets, voting systems, and other applications requiring high-security data management, this app ensures that sensitive data remains encrypted and the server never accesses unhashed user IDs, passwords, or data directly. Built on a PERN stack (PostgreSQL, Express, React, Node.js), this project leverages Redux for state management and Vite for building the front-end efficiently.\"",
  "main": "server/src/index.js",
  "scripts": {
    "build": "npm run build:client",
    "build:client": "cd client && npm run build",
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "lint": "concurrently \"npm run lint:client\" \"npm run lint:server\"",
    "lint:client": "cd client && npm run lint",
    "lint:server": "cd server && npm run lint",
    "test": "concurrently \"npm run test:client\" \"npm run test:server\"",
    "test:client": "cd client && npm run test",
    "test:server": "cd server && npm run test",
    "prod": "npm run build:client && cd server && npm run prod"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chrisallenarmbruster/blockcraft-vault.git"
  },
  "keywords": [
    "blockchain",
    "wallet"
  ],
  "author": "Chris Armbruster",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/chrisallenarmbruster/blockcraft-vault/issues"
  },
  "homepage": "https://github.com/chrisallenarmbruster/blockcraft-vault#readme",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}

```

# server/eslint.config.js

```javascript
import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Add your rules here
    },
  },
];

```

# server/package.json

```json
{
  "name": "blockcraft-vault-server",
  "type": "module",
  "main": "src/index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "prod": "NODE_ENV=production node src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "eslint"
  },
  "devDependencies": {
    "@eslint/js": "^9.2.0",
    "eslint": "^9.2.0",
    "globals": "^15.1.0",
    "nodemon": "^3.1.0"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "connect-session-sequelize": "^7.1.7",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-session": "^1.18.0",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "pg": "^8.11.5",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.3"
  }
}

```

# server/src/app.js

```javascript
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

```

# server/src/db/index.js

```javascript
import Sequelize from "sequelize";
import UserModel from "./models/User.js";

import dotenv from "dotenv";
dotenv.config();

const config = { dialect: "postgres", protocol: "postgres", logging: false };

const sequelize = new Sequelize(process.env.DATABASE_URL, config);

const User = UserModel(sequelize, Sequelize.DataTypes);

async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

async function syncModels() {
  await sequelize.sync({ force: true });
  console.log("All database models were synchronized successfully.");
}

export { User, checkConnection, syncModels, sequelize };

```

# server/src/db/models/User.js

```javascript
import { Model } from "sequelize";

class User extends Model {}

const UserModel = (sequelize, DataTypes) => {
  User.init(
    {
      clientHashedUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      reHashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      encryptedData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

export default UserModel;

```

# server/src/index.js

```javascript
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

async function setUpDatabase() {
  try {
    const { checkConnection, syncModels } = await import("./db/index.js");
    await checkConnection();
    await syncModels();
  } catch (error) {
    console.error("Error setting up the database:", error);
  }
}

async function startApp() {
  try {
    await setUpDatabase();
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the app:", error);
  }
}

startApp();

```

# server/src/routes/auth.js

```javascript
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

```

# server/src/routes/index.js

```javascript
import express from "express";
import auth from "./auth.js";
import vault from "./vault.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/vault", vault);

export default router;

```

# server/src/routes/passportConfig.js

```javascript
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
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

```

# server/src/routes/vault.js

```javascript
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

```

