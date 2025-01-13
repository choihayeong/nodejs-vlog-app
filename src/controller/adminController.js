export const getDashBoard = (req, res) => {
  res.render("admin/dashboard", { pageTitle: "Back Office" });
};
