import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

async function setUpDatabase() {
  try {
    const { User, checkConnection, syncModels } = await import("./db/index.js");
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
