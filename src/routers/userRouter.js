import express from "express";

import {
  deleteUser,
  logout,
  getUserProfile,
  startGithubLogin,
  finishGithubLogin,
  getEditUser,
  postEditUser,
} from "../controller/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", getUserProfile);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditUser)
  .post(postEditUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

export default userRouter;
