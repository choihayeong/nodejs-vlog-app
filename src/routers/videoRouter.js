import express from "express";

import {
  getEditVideo,
  postEditVideo,
  getVideo,
  deleteVideo,
} from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", getVideo);
videoRouter.get("/:id(\\d+)/edit", getEditVideo);
videoRouter.post("/:id(\\d+)/edit", postEditVideo);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
