export const trending = (req, res) => {
  // const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const videos = [
    {
      title: "Welcome :)",
      rating: 4,
      comments: 2,
      createdAt: "2 Minutes Ago",
      views: "1000",
      idx: 1,
    },
    {
      title: "#2 Video",
      rating: 4,
      comments: 2,
      createdAt: "2 Minutes Ago",
      views: "1000",
      idx: 2,
    },
    {
      title: "Whatups",
      rating: 4,
      comments: 2,
      createdAt: "2 Minutes Ago",
      views: "1000",
      idx: 3,
    },
  ];

  return res.render("home", { pageTitle: "Home", videos });
};

export const uploadVideo = (req, res) => res.send("Upload Video");
export const getVideo = (req, res) => {
  const { id } = req.params;

  return res.render("watch", { serialNumber: id });
};
export const editVideo = (req, res) => {
  const { id } = req.params;

  return res.render("edit", { serialNumber: id });
};
export const deleteVideo = (req, res) => res.send("Delete Video");
export const searchVideo = (req, res) => res.send("Search Video");
