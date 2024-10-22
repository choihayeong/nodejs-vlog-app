# Edit User Profile

> wip... 🫠

<hr />

### Protector and Public Middlewares

- 로그인 되어 있는(`req.session.loggedIn === true`) 유저들만 로그아웃을 할 수 있는 `/logout` 페이지 및 유저의 프로필을 업데이트 할 수 있는 `/edit`페이지로 갈 수 있어야함

- `protectorMiddleware`을 추가해준다.

```javascript
// src/middlewares.js
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};
```

```javascript
// src/routers/userRouter.js

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditUser)
  .post(postEditUser);
```

<hr />

- 로그인이 되어 있지 않은 유저들의 경우에 login 페이지로 접근을 시도할 때 `/`로 리다이렉트 시켜줘야함

- `publicOnlyMiddleware`을 추가해준다.

```javascript
// src/middlewares.js
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
```

```javascript
// src/routers/rootRouter.js

rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
```

```javascript
// src/routers/userRouter.js

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
```

<hr />

### Code Challenge

> `src/models/User.js`에서 `userSchema`를 확인해 보면, `user_email`, `user_name`의 속성 중 `unique: true` 이다. <br /> 이 부분을 참고하면, `/users/edit` 페이지에서 유저의 정보를 업데이트할 때 다른 유저와 중복되는 user_email과 user_name을 가지면 안된다.

```javascript
/**
 * ### code challenge
 */
const prevUserInfo = await userModel.findById(_id);

const renderError = (message) => {
  res.status(400).render("edit-profile", {
    pageTitle: "Edit Profile",
    errorMessage: message,
  });
};

// case 1) user_email, user_name 둘 다 이미 존재할 때
const existBoth = {
  status: await userModel.exists({
    $and: [{ user_email }, { user_name }],
  }),
  errorMessage:
    "This user Email/Name already exsists or you haven't change yet",
};

if (existBoth.status) {
  return renderError(existBoth.errorMessage);
}

// case 2) / case 3) user_email / user_name 둘 중 하나 이미 존재하고 있는 것으로 바꾸려고 시도할 때
const exsistsEither = {
  status: await userModel.exists({
    $or: [{ user_email }, { user_name }],
  }),
  errorEmail: "This user Email already exists.",
  errorName: "This user Name already exists.",
};

if (exsistsEither.status) {
  // case 2) user_email을 바꾸려고 할 때
  if (prevUserInfo.user_email !== user_email) {
    const exsists_email = await userModel.exists({ user_email });

    if (exsists_email) {
      return renderError(exsistsEither.errorEmail);
    }
  }

  // case 3) user_name을 바꾸려고 할 때
  if (prevUserInfo.user_name !== user_name) {
    const exsists_name = await userModel.exists({ user_name });

    if (exsists_name) {
      return renderError(exsistsEither.errorName);
    }
  }
}
```

### File Uploads

- `multer` 패키지 설치 (https://www.npmjs.com/package/multer)

```bash
npm i multer
```

### DB realtions

- `populate()` 이용

- Videos의 한개의 video는 owner은 User 하나와 연결되어야함. / User 하나가 소유하는 video는 여러개가 될 수 있음.
