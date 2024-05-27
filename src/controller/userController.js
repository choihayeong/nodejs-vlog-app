import userModel from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {
  const { user_email, user_name, user_password, user_location } = req.body;

  await userModel.create({
    user_email,
    user_name,
    user_password,
    user_location,
  });

  return res.redirect("/login");
};
export const editUser = (req, res) => res.send("Edit User Info");
export const deleteUser = (req, res) => res.send("Delete User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const getUserProfile = (req, res) => res.send("User Profile");
