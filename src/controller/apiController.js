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

// MARK: [Admin] API for Deleting user's All Comments
export const deleteUserAllComments = async (req, res) => {
  const { user_id } = req.params;

  // comments 테이블에 해당 user와 관련된 데이터들 삭제
  await commentModel.deleteMany({ owner: { $in: user_id } });

  // users 테이블의 comments를 초기화
  await userModel.findByIdAndUpdate(user_id, {
    comments: [], // or null.....?
  });

  res.send("Delete User's All Comments");
};
