import videoModel from "../models/Video";

const handleSearch = (err, data) => {
  console.log("errors", err);
  console.log("data", data);
};

export const home = async (req, res) => {
  const videos = await videoModel.find({});

  return res.render("home", { pageTitle: "Home", videos });
};

export const getVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "404 Not Found" });
  }

  return res.render("watch", {
    pageTitle: video.vlog_title,
    video,
  });
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "404 Not Found" });
  }

  return res.render("edit", {
    pageTitle: `Editing: ${video.vlog_title}`,
    video,
  });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  const { vlog_title, vlog_desc, hashtags } = req.body;

  if (!video) {
    return res.render("404", { pageTitle: "404 Not Found" });
  }

  video.vlog_title = vlog_title;
  video.vlog_desc = vlog_desc;
  video.hashtags = hashtags
    .split(",")
    .map((item) => (item.startsWith("#") ? item : `#${item}`));

  await video.save();

  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = (req, res) => res.send("Delete Video");
export const searchVideo = (req, res) => res.send("Search Video");

export const getUploadVideo = (req, res) =>
  res.render("upload", { pageTitle: "Upload your video" });

export const postUploadVideo = async (req, res) => {
  const { vlog_title, vlog_desc, hashtags } = req.body;

  try {
    await videoModel.create({
      vlog_title,
      vlog_desc,
      hashtags: hashtags
        .split(",")
        .map((item) => (item.startWith("#") ? item : `#${item}`)),
    });

    return res.redirect("/");
  } catch (err) {
    return res.render("upload", {
      pageTitle: "Upload your video",
      errMessage: err._message,
    });
  }
};
