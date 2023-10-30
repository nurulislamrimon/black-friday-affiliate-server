// external imports===============
import express, { Request, Response, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// internal imports===============
import * as error_handler from "./middlewares/error_handler";

// dot env configuration
import dotenv from "dotenv";
import router from "./router/router";
dotenv.config();
// create app
const app = express();

// configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

// home route
app.get("/", (req: Request, res: Response) => {
  res.send({ success: true, data: "Welcome to Black friday offers!" });
  console.log("Welcome to Black friday offers");
});

// all routes routes=========

app.use("/api/v1", router);

// error handler======
app.use(error_handler.routeNotFound);

app.use(error_handler.globalErrorHandler);

export default app;
