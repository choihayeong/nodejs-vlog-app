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

### File Uploads : User Avatar

- `multer` 패키지 설치 (https://www.npmjs.com/package/multer)

```bash
npm i multer
```

- `/src/views/edit-profile.pug` 내 파일 업로드 input 추가

```pug
block content
  if errorMessage
    span=errorMessage
  form(method="POST", enctype="multipart/form-data")
    label(for="user_avatar") Avatar
    input(type="file", id="id_avatar", name="user_avatar", accept="image/*")
```

- `/src/middlewares.js`에 multer 임포트

```javascript
import multer from "multer";

export const uploadFiles = multer({ dest: "uploads/" });
```

- 유저의 프로필 편집 페이지 내에 해당 middleware를 추가 `/src/routers/userRouter.js`의 `/eidt` url에 다음을 추가

```javascript
import {
  protectorMiddleware,
  publicMiddleware,
  uploadFiles,
} from "../middlewares";

userRouter
  .route("/edit")
  .all(protetorMiddleware)
  .get(getEditUser)
  .post(uploadFiles.single("user_avatar"), postEditUser);
```

- `/src/controller/userController.js`의 `postEditUser` 수정

```javascript
export const postEditUser = async (req, res) => {
  const {
    session: {
      user: { _id, avatar_url },
    },
    body: { user_email, user_name, user_location },
    file,
  } = req;

  // ...

  const updatedUser = await userModel.findByIdAndUpdate(
    _id,
    {
      user_email,
      avatar_url: file ? file.path : avatar_url,
      user_name,
      user_location,
    },
    { new: true },
  );
};
```

- `/src/server.js` 에 다음을 추가

```javascript
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); // 추가

// ...
```

- `src/views/edit-profile.pug` 에 `user_avatar`가 보이는 `<img />` 태그 추가

```pug
block content
  if errorMessage
    span=errorMessage

  img(src=`/${loggedInUser.avatar_url}`, width="100", height="100")
  form(method="POST", enctype="multipart/form-data")
    //-....
```

### File Uploads : Videos

- 비디오 파일을 업로드 하는 페이지 `/src/views/upload.pug`에 다음을 추가

```pug
block content
  if errorMessage
    p=errorMessage
  form(method="POST", enctype="multipart/form-data")
    label(for="vlog_video") Video File
    input(type="file", id="vlog_video", name="vlog_video", accept="video/*", required)
```

- `/src/middleware.js`에서 `uploadsFiles`를 `avatarUpload`와 `videoUpload`로 분리 (`fileSize` 속성 추가)

```javascript
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000, // 3MB
  },
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 10000000, // 10MB
  },
});
```

- `/src/routers/userRouter.js` 와 `/src/router/videoRouter.js`를 다음과 같이 수정

```javascript
import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
} from "../middlewares";

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditUser)
  .post(avatarUpload.single("user_avatar"), postEditUser);
```

```javascript
import { protectorMiddleware, videoUpload } from "../middlewares";

videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUploadVideo)
  .post(videoUpload.single("vlog_video"), postUploadVideo);
```

- `/src/models/Video.js` 에 `file_url` 추가

```javascript
const videoSchema = new mongoose.Schema({
  vlog_title: { type: String, required: true, trim: true, maxLength: 80 },
  vlog_desc: { type: String, required: true, trim: true, minLength: 30 },
  file_url: { type: String, required: true }, // 추가
  published_date: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  // ...
});
```

- `/src/controller/videoController.js` 에서 `postUploadVideo` 메서드 내 file_url 속성 추가해줌

```javascript
export const postUploadVideo = async (req, res) => {
  const { path: file_url } = req.file;

  try {
    await videoModel.create({
      vlog_title,
      vlog_desc,
      file_url,
      hashtags: videoModel.formatHashtags(hashtags),
    });

    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("upload", {
      //...
    });
  }
};
```

- 비디오 재생되는 페이지 `/src/views/watch.pug` 내에서 `<video />` 태그 추가

```pug
extends base

block content
  video(src=`/${video.file_url}`, controls, autoplay)

  div
    p=video.vlog_desc
    small=video.published_date
```
