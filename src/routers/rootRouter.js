import express from "express";

import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from "../controller/userController";

import {
  getJoinMember,
  postJoinMember,
  getLoginMember,
  postLoginMember,
} from "../controller/memberController";

import { home, searchVideo } from "../controller/videoController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/join2")
  .all(publicOnlyMiddleware)
  .get(getJoinMember)
  .post(postJoinMember);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter
  .route("/login2")
  .all(publicOnlyMiddleware)
  .get(getLoginMember)
  .post(postLoginMember);

rootRouter.get("/logout", protectorMiddleware, logout);
rootRouter.get("/search", searchVideo);

export default rootRouter;
