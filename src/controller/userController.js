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

  const user = await userModel.findOne({ user_name, social_only: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: PAGE_TITLE,
      errorMessage: "An account with this user name does not exists.",
    });
  }

  // check if password correct
  const ok = await bcrypt.compare(user_password, user.user_password);

  if (!ok) {
    return res.status(400).render("login", {
      PAGE_TITLE,
      errorMessage: "Wrong Password",
    });
  }

  // 유저가 로그인 하면 그 유저에 대한 정보를 세션에 담음
  req.session.loggedIn = true;
  req.session.user = user;

  res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const BASE_URL = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const CUSTOM_URL = `${BASE_URL}?${params}`;

  return res.redirect(CUSTOM_URL);
};

export const finishGithubLogin = async (req, res) => {
  const BASE_URL = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const CUSTOM_URL = `${BASE_URL}?${params}`;

  const tokenRequest = await (
    await fetch(CUSTOM_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const API_URL = "https://api.github.com";

    const userData = await (
      await fetch(`${API_URL}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${API_URL}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true,
    );

    if (!emailObj) {
      // set notification
      return res.redirect("/login");
    }

    // github login의 이메일이 DB에 존재하면 로그인 시켜쥼
    let user = await userModel.findOne({
      user_email: emailObj.email,
    });

    if (!user) {
      // create an account (DB에 존재하지 않을 경우)
      user = await userModel.create({
        user_email: emailObj.email,
        social_only: true,
        avatar_url: userData.avartar_url,
        user_name: userData.name,
        user_password: "",
        user_location: userData.location,
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();

  return res.redirect("/");
};

export const getEditUser = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEditUser = (req, res) => {
  return res.render("edit-profile");
};

// export const editUser = (req, res) => res.send("Edit User Info");
export const deleteUser = (req, res) => res.send("Delete User");
export const getUserProfile = (req, res) => res.send("User Profile");
