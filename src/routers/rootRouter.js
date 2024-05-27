import express from "express";

import { getJoin, postJoin, login } from "../controller/userController";
import { home, searchVideo } from "../controller/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
// rootRouter.get("/join", join);
rootRouter.get("/login", login);
rootRouter.get("/search", searchVideo);

export default rootRouter;
