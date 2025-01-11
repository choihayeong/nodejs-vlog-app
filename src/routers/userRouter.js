import express from "express";

import {
  deleteUser,
  getUserProfile,
  startGithubLogin,
  finishGithubLogin,
  getEditUser,
  postEditUser,
  getChangePassword,
  postChangePassword,
  getUserComments,
} from "../controller/userController";
import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditUser)
  .post(avatarUpload.single("user_avatar"), postEditUser);

userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

userRouter.get("/:id", getUserProfile);
userRouter.get("/:id/comments", getUserComments);

export default userRouter;
