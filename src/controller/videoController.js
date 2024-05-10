// dummy data : videos
let videos = [
  {
    vlog_title: "Welcome :)",
    rating: 4,
    comments: 2,
    createdAt: "2 Minutes Ago",
    views: 1000,
    idx: 1,
  },
  {
    vlog_title: "#2 Video",
    rating: 4,
    comments: 2,
    createdAt: "2 Minutes Ago",
    views: 999,
    idx: 2,
  },
  {
    vlog_title: "Whatups",
    rating: 4,
    comments: 2,
    createdAt: "2 Minutes Ago",
    views: 1,
    idx: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};

export const getVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("watch", {
    pageTitle: `Watching ${video.vlog_title}`,
    video,
  });
};
export const getEditVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("edit", {
    pageTitle: `Editing: ${video.vlog_title}`,
    video,
  });
};
export const postEditVideo = (req, res) => {
  const { id } = req.params;

  const { vlog_title } = req.body;

  videos[id - 1].vlog_title = vlog_title;

  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = (req, res) => res.send("Delete Video");
export const searchVideo = (req, res) => res.send("Search Video");

export const getUploadVideo = (req, res) =>
  res.render("upload", { pageTitle: "Upload your video" });

export const postUploadVideo = (req, res) => {
  // console.log(req.body);
  const { vlog_title } = req.body;

  const newVideo = {
    vlog_title,
    rating: 0,
    comments: 0,
    createdAt: "Just Now",
    views: 0,
    idx: videos.length + 1,
  };

  videos.push(newVideo);

  return res.redirect("/");
};
