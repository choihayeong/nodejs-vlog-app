import express from "express";

import {
  getEditVideo,
  postEditVideo,
  getVideo,
  deleteVideo,
  getUploadVideo,
  postUploadVideo,
} from "../controller/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUploadVideo)
  .post(videoUpload.fields([{name: "vlog_video", maxCount: 1}, {name: "vlog_thumbnail", maxCount: 1}]), postUploadVideo);

videoRouter.get("/:id([0-9a-f]{24})", getVideo);

videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEditVideo)
  .post(postEditVideo);

videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);

export default videoRouter;
