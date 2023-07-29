import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import roleRoute from "./routes/roleRoute.js";
import { mongoDbConnection } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Init Express.
const app = express();

// Invironment variables.
dotenv.config();
const PORT = process.env.PORT || 9090;

// Middlewares.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Static Folder.
app.use(express.static("public"));

// Routes.
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/role", roleRoute);

// errorHandler.
app.use(errorHandler);

// Listen server.
app.listen(PORT, () => {
  mongoDbConnection();
  console.log(`Server is running on PORT ${PORT}`.bgBlue.black);
});
