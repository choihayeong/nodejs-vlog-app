export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
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
