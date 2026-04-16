import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
import v1router from "./app/routes/v1.js";
import httpStatus from "http-status";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("trust proxy", 1);
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: [
      "https://dev.furcareindia.com",
      "https://furcareindia.com",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1", v1router);
app.use(globalErrorHandler);

app.get("/", (_req, res) => {
  res.send("Furcare API Backend");
});

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Not Found",
    errors: [
      {
        path: `${req.method} ${req.originalUrl}`,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default app;
