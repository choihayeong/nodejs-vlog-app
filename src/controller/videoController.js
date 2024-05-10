import videoModel from "../models/Video";

const handleSearch = (err, data) => {
  console.log("errors", err);
  console.log("data", data);
};

export const home = (req, res) => {
  videoModel.find({}).then(handleSearch);

  return res.render("home", { pageTitle: "Home", videos: [] });
};

export const getVideo = (req, res) => {
  const { id } = req.params;

  return res.render("watch", {
    pageTitle: `Watching`,
  });
};
export const getEditVideo = (req, res) => {
  const { id } = req.params;

  return res.render("edit", {
    pageTitle: `Editing:`,
  });
};
export const postEditVideo = (req, res) => {
  const { id } = req.params;
  const { vlog_title } = req.body;

  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = (req, res) => res.send("Delete Video");
export const searchVideo = (req, res) => res.send("Search Video");

export const getUploadVideo = (req, res) =>
  res.render("upload", { pageTitle: "Upload your video" });

export const postUploadVideo = (req, res) => {
  const { vlog_title } = req.body;

  return res.redirect("/");
};
