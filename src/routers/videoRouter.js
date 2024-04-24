import express from "express";

import {
  getEditVideo,
  postEditVideo,
  getVideo,
  deleteVideo,
} from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", getVideo);

videoRouter.route("/:id(\\d+)/edit").get(getEditVideo).post(postEditVideo);

videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
