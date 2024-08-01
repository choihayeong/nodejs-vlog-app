import express from "express";

import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controller/userController";

import { getJoinMember, postJoinMember } from "../controller/memberController";

import { home, searchVideo } from "../controller/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/join2").get(getJoinMember).post(postJoinMember);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", searchVideo);

export default rootRouter;
