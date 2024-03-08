import express from "express";

import {
  editUser,
  deleteUser,
  logout,
  getUserProfile,
} from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/:id(\\d+)", getUserProfile);
userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);

export default userRouter;
