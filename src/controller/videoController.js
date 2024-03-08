export const trending = (req, res) => res.render("home");
export const uploadVideo = (req, res) => res.send("Upload Video");
export const getVideo = (req, res) => {
  const { id } = req.params;

  return res.render("watch");
};
export const editVideo = (req, res) => {
  const { id } = req.params;

  return res.send(`Edit #${id} Video`);
};
export const deleteVideo = (req, res) => res.send("Delete Video");
export const searchVideo = (req, res) => res.send("Search Video");
