import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";

import routes from "src/routes";
import uploadConfig from "src/config/upload";
import AppError from "src/errors/AppError";

const app = express();
app.use(express.json());
app.use("/files", express.static(uploadConfig.directory));
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    console.error(err);

    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

export default app;
