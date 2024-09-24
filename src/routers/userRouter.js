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

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", getUserProfile);
userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEditUser).post(postEditUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
