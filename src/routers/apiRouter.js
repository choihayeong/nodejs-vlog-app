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
  updateVideosComments,
} from "../controller/apiController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete(
  "/comment/:comment_id([0-9a-f]{24})/video/:video_id",
  deleteComment,
);
apiRouter.delete("/video/:id([0-9a-f]{24})", deleteVideo);

/**
 * ❗[Admin] : 해당 유저 아이디의 비디오 모두 삭제
 */
apiRouter.delete(
  "/user/:user_id([0-9a-f]{24})/videos-all",
  deleteUserAllVideos,
);

/**
 * ❗[Admin] : 비디오 삭제 시 유저의 videos 속성 업데이트 (DB)
 */
apiRouter.put("/user/:user_id([0-9a-f]{24})/videos", updateUserVideos);

/**
 * ❗[Admin] : 해당 유저 아이디의 코멘트 모두 삭제
 */
apiRouter.delete(
  "/user/:user_id([0-9a-f]{24})/comments-all",
  deleteUserAllComments,
);

/**
 * ❗[Admin] : 해당 비디오의 코멘트 모두 삭제
 */
apiRouter.delete(
  "/video/:video_id([0-9a-f]{24})/comments-all",
  deleteVideoAllComments,
);

/**
 * ❗[Admin] : 코멘트가 삭제될 경우 비디오의 comments 속성 업데이트 (DB)
 */
apiRouter.put("/video/:video_id([0-9a-f]{24})/comments", updateVideosComments);

export default apiRouter;
