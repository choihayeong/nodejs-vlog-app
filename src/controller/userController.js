import userModel from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {
  const {
    user_email,
    user_name,
    user_password,
    confirm_password,
    user_location,
  } = req.body;

  const PAGE_TITLE = "Join";

  if (user_password !== confirm_password) {
    return res.status(400).render("join", {
      pageTitle: PAGE_TITLE,
      errorMessage: "Confirmed Password does not match",
    });
  }

  const exists = await userModel.exists({
    $or: [{ user_name }, { user_email }],
  });

  if (exists) {
    return res.status(400).render("join", {
      pageTitle: PAGE_TITLE,
      errorMessage: "This user name/email already exists",
    });
  }

  await userModel.create({
    user_email,
    user_name,
    user_password,
    user_location,
  });

  return res.redirect("/login");
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { user_name, user_password } = req.body;
  const PAGE_TITLE = "Login";

  const user = await userModel.findOne({ user_name });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: PAGE_TITLE,
      errorMessage: "An account with this user name does not exists.",
    });
  }

  // check if password correct
  const ok = await bcrypt.compare(
    user_password,
    user.user_password,
    function (err, result) {
      if (result) {
        return res.redirect("/");
      } else {
        return res.status(400).render("login", {
          pageTitle: PAGE_TITLE,
          errorMessage: "Wrong Password.",
        });
      }
    },
  );
};

export const editUser = (req, res) => res.send("Edit User Info");
export const deleteUser = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Logout");
export const getUserProfile = (req, res) => res.send("User Profile");
