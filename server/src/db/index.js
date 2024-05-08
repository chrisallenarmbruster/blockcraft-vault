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
  await sequelize.sync({ force: false });
  console.log("All database models were synchronized successfully.");
}

export { User, checkConnection, syncModels, sequelize };
