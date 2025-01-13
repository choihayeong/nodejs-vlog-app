import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
  deleteUserAllComments,
  deleteVideoAllComments,
  deleteVideo,
  deleteUserAllVideos,
  updateUserVideos,
} from "../controller/apiController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete(
  "/comment/:comment_id([0-9a-f]{24})/video/:video_id([0-9a-f]{24})",
  deleteComment,
);
apiRouter.delete("/video/:id([0-9a-f]{24})/delete", deleteVideo);

/**
 * ❗[Admin] : 해당 유저 아이디의 비디오 모두 삭제
 */
apiRouter.get("/videos/:user_id([0-9a-f]{24})/user", deleteUserAllVideos);

/**
 * ❗[Admin] : 비디오 삭제 시 유저의 videos 속성 업데이트
 */
apiRouter.put("/user/:user_id([0-9a-f]{24})/videos", updateUserVideos);

/**
 * ❗[Admin] : 해당 유저 아이디의 코멘트 모두 삭제
 */
apiRouter.get("/comments/:user_id([0-9a-f]{24})/user", deleteUserAllComments);

/**
 * ❗[Admin] : 해당 비디오의 코멘트 모두 삭제
 */
apiRouter.get(
  "/comments/:video_id([0-9a-f]{24})/video",
  deleteVideoAllComments,
);

export default apiRouter;
