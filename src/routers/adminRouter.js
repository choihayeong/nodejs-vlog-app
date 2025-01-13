import express from "express";
import { getDashBoard } from "../controller/adminController";

const adminRouter = express.Router();

adminRouter.get("/", getDashBoard);

export default adminRouter;
