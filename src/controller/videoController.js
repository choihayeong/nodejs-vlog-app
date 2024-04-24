// dummy data : videos
let videos = [
  {
    title: "Welcome :)",
    rating: 4,
    comments: 2,
    createdAt: "2 Minutes Ago",
    views: 1000,
    idx: 1,
  },
  {
    title: "#2 Video",
    rating: 4,
    comments: 2,
    createdAt: "2 Minutes Ago",
    views: 999,
    idx: 2,
  },
  {
    title: "Whatups",
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

  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const getEditVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEditVideo = (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  videos[id - 1].title = title;

  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = (req, res) => res.send("Delete Video");
export const searchVideo = (req, res) => res.send("Search Video");

// export const uploadVideo = (req, res) => res.send("Upload Video");
