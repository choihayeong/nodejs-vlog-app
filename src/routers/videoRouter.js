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

videoRouter.get("/:id(\\d+)", getVideo);

videoRouter.route("/:id(\\d+)/edit").get(getEditVideo).post(postEditVideo);

videoRouter.get("/:id(\\d+)/delete", deleteVideo);

// videoRouter.get("/upload", getUploadVideo);

// videoRouter.post("upload", postUploadVideo);

videoRouter.route("/upload").get(getUploadVideo).post(postUploadVideo);

export default videoRouter;
