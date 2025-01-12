import userModel from "../models/User";
import videoModel from "../models/Video";

// MARK: Home(ALL Videos)
export const home = async (req, res) => {
  const videos = await videoModel
    .find({})
    .sort({ published_date: "desc" })
    .populate("owner");

  return res.render("home", { pageTitle: "Home", videos });
};

// MARK: READ Video
export const getVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel
    .findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
        model: "User",
      },
    });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Not Found" });
  }

  return res.render("watch", {
    pageTitle: video.vlog_title,
    video,
  });
};

// MARK: UPDATE for Video
export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await videoModel.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Not Found" });
  }

  console.log(video);

  if (String(video.owner) !== _id) {
    req.flash("error", "You are not the owner of this video");

    return res.status(403).redirect("/");
  }

  return res.render("edit", {
    pageTitle: `Editing: ${video.vlog_title}`,
    video,
  });
};

export const postEditVideo = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { vlog_title, vlog_desc, hashtags } = req.body;
  const video = await videoModel.exists({ _id: id });

  const videoModified = await videoModel.findByIdAndUpdate(id, {
    vlog_title,
    vlog_desc,
    hashtags: videoModel.formatHashtags(hashtags),
  });

  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Not Found" });
  }

  if (String(videoModified.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  req.flash("success", "Changes saved.");

  return res.redirect(`/videos/${id}`);
};

// MARK: Search
export const searchVideo = async (req, res) => {
  const { keyword } = req.query;

  console.log(req.query);

  let videos = [];

  if (keyword) {
    videos = await videoModel
      .find({
        vlog_title: {
          $regex: new RegExp(`${keyword}$`, "i"),
        },
      })
      .populate("owner");
  }

  return res.render("search", { pageTitle: "Search Video", videos, keyword });
};

// MARK: CREATE Video
export const getUploadVideo = (req, res) =>
  res.render("upload", { pageTitle: "Upload your video" });

export const postUploadVideo = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { vlog_video, vlog_thumbnail } = req.files;
  const { vlog_title, vlog_desc, hashtags } = req.body;

  try {
    const newVideo = await videoModel.create({
      vlog_title,
      vlog_desc,
      file_url: vlog_video[0].path,
      thumbnail_url: vlog_thumbnail[0].path.replace(/[\\]/g, "/"),
      owner: _id,
      hashtags: videoModel.formatHashtags(hashtags),
    });
    const user = await userModel.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("upload", {
      pageTitle: "Upload your video",
      errorMessage: err._message,
    });
  }
};
