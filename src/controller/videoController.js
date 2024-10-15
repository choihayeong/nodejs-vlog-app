import userModel from "../models/User";
import videoModel from "../models/Video";

export const home = async (req, res) => {
  const videos = await videoModel.find({}).sort({ published_date: "desc" });

  return res.render("home", { pageTitle: "Home", videos });
};

export const getVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  const owner = await userModel.findById(video.owner);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Not Found" });
  }

  return res.render("watch", {
    pageTitle: video.vlog_title,
    video,
    owner,
  });
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Not Found" });
  }

  return res.render("edit", {
    pageTitle: `Editing: ${video.vlog_title}`,
    video,
  });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.exists({ _id: id });
  const { vlog_title, vlog_desc, hashtags } = req.body;

  if (!video) {
    return res.status(404).render("404", { pageTitle: "404 Not Found" });
  }

  await videoModel.findByIdAndUpdate(id, {
    vlog_title,
    vlog_desc,
    hashtags: videoModel.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  await videoModel.findByIdAndDelete(id);

  return res.redirect("/");
};

export const searchVideo = async (req, res) => {
  const { keyword } = req.query;

  let videos = [];

  if (keyword) {
    videos = await videoModel.find({
      vlog_title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
  }

  return res.render("search", { pageTitle: "Search Video", videos });
};

export const getUploadVideo = (req, res) =>
  res.render("upload", { pageTitle: "Upload your video" });

export const postUploadVideo = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { path: file_url } = req.file;
  const { vlog_title, vlog_desc, hashtags } = req.body;

  try {
    await videoModel.create({
      vlog_title,
      vlog_desc,
      file_url,
      owner: _id,
      hashtags: videoModel.formatHashtags(hashtags),
    });

    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("upload", {
      pageTitle: "Upload your video",
      errMessage: err._message,
    });
  }
};
