import memberModel from "../models/Member";
import bcrypt from "bcrypt";

export const getJoinMember = (req, res) =>
  res.render("join2", { pageTitle: "Join our Member!" });
export const postJoinMember = async (req, res) => {
  const {
    member_email,
    member_name,
    member_password,
    member_password2,
    member_realname,
    member_location,
  } = req.body;

  const PAGE_TITLE = "Join Our Member";

  if (member_password !== member_password2) {
    return res.status(400).render("join2", {
      PAGE_TITLE,
      errMessage: "Password confirmation does not match.",
    });
  }

  const memberExists = await memberModel.exists({
    $or: [{ member_name }, { member_email }],
  });

  if (memberExists) {
    return res.status(400).render("join2", {
      PAGE_TITLE,
      errMessage: "This member is already taken.",
    });
  }

  try {
    await memberModel.create({
      member_email,
      member_name,
      member_password,
      member_realname,
      member_location,
    });

    return res.redirect("/login");
  } catch (err) {
    return res.status(400).render("join2", {
      PAGE_TITLE,
      errMessage: err._message,
    });
  }
};

export const getLoginMember = (req, res) =>
  res.render("login2", { pageTitle: "Login Member" });

export const postLoginMember = async (req, res) => {
  const { member_name, member_password } = req.body;
  const PAGE_TITLE = "Login Member";

  // check if account exists
  const member = await memberModel.findOne({ member_name });
  if (!member) {
    return res
      .status(400)
      .render("login2", {
        PAGE_TITLE,
        errMessage: "An account with this member name does not exist.",
      });
  }

  // check if password correct
  const ok = await bcrypt.compare(member_password, member.member_password);
  if (!ok) {
    return res.status(400).render("login2", {
      PAGE_TITLE,
      errMessage: "Wrong Password",
    });
  }

  console.log("LOG MEMBER IN : COMING SOON!");
  res.redirect("/");
};
