import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 3030;

const app = express();
const logger = morgan("dev");

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

// routers
app.use(logger);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

// server
const handleListening = () =>
  console.log(`✅ Server Listening on Port http://localhost:${PORT} 👾`);

app.listen(PORT, handleListening);
