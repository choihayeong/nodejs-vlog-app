import videoModel from "../models/Video";
import userModel from "../models/User";
import commentModel from "../models/Comment";

// MARK: API for Video views
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  video.meta.views = video.meta.views + 1;
  await video.save();

  return res.sendStatus(200);
};

// MARK: API for Delete a Video
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const video = await videoModel.findById(id).populate("comments");
  const videoOwner = await userModel.findById(video.owner);
  const videoComments = video.comments;

  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Not Found." });
  }

  if (String(video.owner) !== _id) {
    return res.status(401).redirect("/");
  }

  // 비디오 소유자가 비디오를 삭제했을 때 관련된 유저 테이블에 있는 댓글 속성들 업데이트
  let commentsId = [];

  for (let i = 0; i < videoComments.length; i++) {
    commentsId.push(String(videoComments[i]._id));
  }

  let commentsUserId = [];

  for (let i = 0; i < videoComments.length; i++) {
    commentsUserId.push(videoComments[i].owner);
  }

  for (let i = 0; i < commentsUserId.length; i++) {
    const user = await userModel.findById(commentsUserId[i]);
    const userComments = user.comments;
    let updatedComments = [];

    updatedComments = userComments.filter(
      (item) => !commentsId.includes(String(item)),
    );

    await userModel.findByIdAndUpdate(commentsUserId[i], {
      comments: updatedComments,
    });
  }

  await videoModel.findByIdAndDelete(id);

  // users 테이블에서 해당 유저의 videos 속성 업데이트
  await userModel.findByIdAndUpdate(video.owner, {
    videos: videoOwner.videos.filter(
      (item) => String(item) !== String(video._id),
    ),
  });

  // comments 테이블 업데이트
  await commentModel.deleteMany({ video: { $in: id } });

  return res.sendStatus(202);
};

// MARK: API for Video comments
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const video = await videoModel.findById(id);
  const comment_user = await userModel.findById(user._id);

  if (!video) {
    return res.sendStatus(404);
  }

  const comment = await commentModel.create({
    comment_text: text,
    owner: user._id,
    video: id,
  });

  video.comments.push(comment._id);
  video.save();

  comment_user.comments.push(comment._id);
  comment_user.save();

  return res.status(201).json({ newCommentId: comment._id }); // 201 Status means "Created"
};

// MARK: API for Delete a Comment
export const deleteComment = async (req, res) => {
  const {
    session: { user },
    params: { comment_id, video_id },
  } = req;

  const comment = await commentModel.findById(comment_id).populate("video");
  const commentOwner = await userModel.findById(comment.owner);
  const userComments = commentOwner.comments;
  const videoComments = comment.video.comments;

  if (!comment) {
    req.flash("error", "Not Found");
    return;
  }

  if (String(comment.owner) !== user._id) {
    req.flash("error", "Not Authorized");
    return;
  }

  await commentModel.findByIdAndDelete(comment_id);

  // deleting relation comments data in other models
  await videoModel.findByIdAndUpdate(video_id, {
    comments: videoComments.filter((item) => String(item) !== comment_id),
  });

  await userModel.findByIdAndUpdate(user._id, {
    comments: userComments.filter((item) => String(item) !== comment_id),
  });

  return res.sendStatus(202);
};

// MARK: [Admin] API for Deleting user's All Videos
// ---> 유저가 모든 비디오를 삭제하면...? 비디오와 관련된 댓글들도 삭제해줘야함...! (유저 테이블에서 관련 비디오 댓글 삭제 (비디오 및 코멘트가 삭제되면 유저의 데이터가 업데이트 되어야함) / 비디오 테이블에서 해당 유저와 관련된 비디오 데이터들 삭제 / 코멘트 테이블에서 해당 비디오와 관련된 코멘트 테이터들 삭제)
export const deleteUserAllVideos = async (req, res) => {
  const { user_id } = req.params;

  // users 테이블의 해당 유저의 videos 속성을 초기화
  await userModel.findByIdAndUpdate(user_id, {
    videos: [],
  });

  // videos 테이블에서 관련 owner(유저)에 해당하는 데이터 삭제
  await videoModel.deleteMany({ owner: { $in: user_id } });

  // [wip] comments.....

  return res.send("Delete User's All Videos");
};

// MARK: [Admin] API for Updating user's Videos
export const updateUserVideos = async (req, res) => {
  const { user_id } = req.params;

  let allVideosId = [];
  const allVideos = await videoModel.find({}); // 모든 비디오를 체크를 해줘야 한다...?
  const user = await userModel.findById(user_id);
  const userVideos = user.videos;

  if (!user) {
    return res.status(404).render("404", { pageTitle: "404 Not Found" });
  }

  for (let i = 0; i < allVideos.length; i++) {
    allVideosId.push(allVideos[i]._id);
  }

  await userModel.findByIdAndUpdate(user_id, {
    videos: allVideosId.filter((e) => userVideos.indexOf(e) > -1),
  });

  return res.sendStatus(202);
};

// MARK: [Admin] API for Deleting user's All Comments
export const deleteUserAllComments = async (req, res) => {
  const { user_id } = req.params;

  const user = await userModel.findById(user_id).populate({
    path: "comments",
    populate: {
      path: "video",
    },
  });

  const { comments } = user;

  // 유저가 댓글을 삭제했을 때 관련된 비디오에 있는 댓글들도 삭제해 줘야함
  let commentsId = [];

  for (let i = 0; i < comments.length; i++) {
    commentsId.push(String(comments[i]._id));
  }

  let videosId = [];

  for (let i = 0; i < comments.length; i++) {
    videosId.push(comments[i].video._id);
  }

  videosId = videosId.filter((e, index) => videosId.indexOf(e) === index);

  for (let i = 0; i < videosId.length; i++) {
    const video = await videoModel.findById(videosId[i]);
    const videoComments = video.comments;
    let updatedComments = [];

    updatedComments = videoComments.filter(
      (item) => !commentsId.includes(String(item)),
    );

    await videoModel.findByIdAndUpdate(videosId[i], {
      comments: updatedComments,
    });
  }

  // comments 테이블에 해당 user와 관련된 데이터들 삭제
  await commentModel.deleteMany({ owner: { $in: user_id } });

  // users 테이블의 comments를 초기화
  await userModel.findByIdAndUpdate(user_id, {
    comments: [],
  });

  // res.sendStatus(202);
  res.send("Delete User's All Comments");
};

// MARK: [Admin] API for Updating user's Comments
export const updateUserComments = async (req, res) => {};

// MARK: [Admin] API for Deleting video's All Comments
export const deleteVideoAllComments = async (req, res) => {
  const { video_id } = req.params;

  // comments 테이블에 해당 video와 관련된 데이터들 삭제
  await commentModel.deleteMany({ video: { $in: video_id } });

  // videos 테이블의 comments를 초기화
  await videoModel.findByIdAndUpdate(video_id, {
    comments: [],
  });

  // [TBD] 유저 테이블에서 comments속성 업데이트

  res.send("Delete Video's All Comments");
};

// MARK: [Admin] API for Updating video's Comments
export const updateVideosComments = async (req, res) => {
  const { video_id } = req.params;

  let allCommentsId = [];
  const allComments = await commentModel.find({});
  const video = await videoModel.findById(video_id);
  const videoComments = video.comments;

  for (let i = 0; i < allComments.length; i++) {
    allCommentsId.push(allComments[i]._id);
  }

  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Not Found." });
  }

  await videoModel.findByIdAndUpdate(video_id, {
    comments: allCommentsId.filter((e) => videoComments.indexOf(e) > -1),
  });

  res.sendStatus(202);
};
