import app from "./app.js";
import env from "./utils/env.js";

const server = app.listen(env.common.port, () => {
  console.log(`Server running on port ${env.common.port}`);
});

const exitHandler = (error: Error) => {
  console.log("SERVER ERROR: ", error);
  if (server) server.close();
  process.exit(1);
};

process.on("uncaughtException", exitHandler);
process.on("unhandledRejection", exitHandler);

process.on("SIGTERM", () => {
  console.log("SERVER ERROR: SIGTERM received");
  if (server) {
    server.close();
  }
});
