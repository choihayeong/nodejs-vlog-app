import express from "express";

import {
  editUser,
  deleteUser,
  logout,
  getUserProfile,
  startGithubLogin,
  finishGithubLogin,
} from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", getUserProfile);
userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
