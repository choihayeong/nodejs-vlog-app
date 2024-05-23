import express from "express";

import {
  getEditVideo,
  postEditVideo,
  getVideo,
  deleteVideo,
  getUploadVideo,
  postUploadVideo,
} from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUploadVideo).post(postUploadVideo);

videoRouter.get("/:id([0-9a-f]{24})", getVideo);

videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEditVideo)
  .post(postEditVideo);

videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);

export default videoRouter;
