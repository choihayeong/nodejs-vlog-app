# Database : users

## Model

- `User.js` 모델을 먼저 만들어야함 (`src/models/User.js` 파일 생성)

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  user_name: { type: String, required: true, unique: true },
  user_password: { type: String, required: true },
  user_location: String,
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
```

## Router (`/join` 페이지 연결)

- `rootRouter.js` (이전 `globalRouter.js`)에서 `/join` 페이지로 연결해줌

```javascript
// AS-IS
rootRouter.get("/join", join);
```

```javascript
// TO-BE
rootRouter.route("/join").get(getJoin).post(postJoin);
```

- `userController.js`에서 `getJoin`과 `postJoin`을 만들어서 `rootRouter.js`에 있는 `/join` 페이지로 연결하는 곳에 렌더링

```javascript
export const getJoin = (req, res) => res.render("join", { pageTitle: "join" });
export const postJoin = async (req, res) => {};
```

- `postJoin` 수정 : `userController.js`에서 users 관련 DB 모델 임포트

```javascript
import userModel from "../models/User";

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
```

## Template (`/join` 페이지 생성)

- `src/views/join.pug` 페이지 생성

  - `<input />`의 name은 `models/User.js`의 스키마에 정의된 속성 이름과 일치하게 해줌

```pug
extends base

block content
    form(method="post")
        input(type="email", name="user_email", placeholder="your email", required)
        input(type="text", name="user_name", placeholder="your unique name", required)
        input(type="password", name="user_password", placeholder="your password", required)
        input(type="text", placeholder="your location (optional)", name="user_location")
        input(type="submit" value="Join")
```

- `base.pug`의 nav에 `/join` 페이지로 연결하는 부분 추가

```pug
  body
    header
      h1=pageTitle
      nav
        ul
            li
                a(href="/videos/upload") Upload Video
            li
                a(href="/") Home
            li
                a(href="/search") Search
            li
                a(href="/join") Join
    main
      block content
```

## Hashing Passwords

- [npm : bcrypt](https://www.npmjs.com/package/bcrypt) : <b>rainbow table</b> 공격을 막아줌...

```bash
npm i bcrypt
```

- `src/models/User.js`에서 다음을 임포트하고 추가

```javascript
import mongoose from "mongoose";
import bcrypt from "bcrypt"; /* 해당부분 임포트 */

const userSchema = new mongoose.Schema({
  user_email: { type: String, required: true, unique: true },
  user_name: { type: String, required: true, unique: true },
  user_password: { type: String, required: true },
  user_location: String,
});

/* 아래 부분 추가 */
userSchema.pre("save", async function () {
  this.user_password = await bcrypt.hash(this.user_password, 5);
});

// ...
```

## Validation

### `unique` 속성인 `user_email`, `user_name` 체크 : `Model.exists()`

- `user_name`, `user_email`은 unique 값이므로 `userController.js`에서 해당 값들이 중복되면 `errorMessage`를 출력하는 함수를 만들어 준다.

```javascript
export const postJoin = async (req, res) => {
  const { user_email, user_name, user_password, user_location } = req.body;
  /* 아래부분 추가 */
  const PAGE_TITLE = "Join";

  const userNameExists = await userModel.exists({ user_name });

  if (userNameExists) {
    return res.render("join", {
      pageTitle: PAGE_TITLE,
      errorMessage: "This user name already exists",
    });
  }

  const userEmailExists = await userModel.exists({ user_email });

  if (userEmailExists) {
    return res.render("join", {
      pageTitle: PAGE_TITLE,
      errorMessage: "This email already exists",
    });
  }
  /* */

  await userModel.create({
    user_email,
    user_name,
    user_password,
    user_location,
  });

  return res.redirect("/login");
};
```

- `join.pug` 템플릿에서 에러 메시지 출력

```pug
extends base

block content
  if errorMessage
    span=errorMessage
  form(method="post")
    //- ...
```

- refactoring : `$or` operator를 이용해서 `user_name`, `user_email` 체크

```javascript
export const postJoin = async (req, res) => {
  const { user_email, user_name, user_password, user_location } = req.body;

  const PAGE_TITLE = "Join";

  const exists = await userModel.exists({
    $or: [{ user_name }, { user_email }],
  });

  if (exists) {
    return res.render("join", {
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
```

### Confirm Password

- `userController.js`에서 `user_password`와 `confirm_password` 일치 여부를 체크하는 함수를 작성

```javascript
export const postJoin = async (req, res) => {
  const {
    user_email,
    user_name,
    user_password,
    confirm_password,
    user_location,
  } = req.body; // confirm_password 추가

  const PAGE_TITLE = "Join";

  /* 아래 부분 추가 */
  if (user_password !== confirm_password) {
    return res.render("join", {
      pageTitle: PAGE_TITLE,
      errorMessage: "Confirmed Password does not match",
    });
  }
  /* */

  const exists = await userModel.exists({
    $or: [{ user_name }, { user_email }],
  });

  if (exists) {
    return res.render("join", {
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
```

### Status Code

- 기본적으로 페이지 이동 상태(Status) 기본 값은 `200`

  - 상태 값이 `200`일 때 브라우저에서 최초에 회원 가입이나 로그인 할때 아이디/비밀번호 입력하면 양식을 저장하시겠습니까? 라는 알람이 뜨게 됨

  - Validation의 결과 errorMessage가 출력되어야 하는 경우엔 이러한 알람이 뜨지 않도록 상태 값을 지정해줄 수 있음. 이 경우 Bad Request 값 `400`을 지정해 주면 됨.

```javascript
// userController.js

if (user_password !== confirm_password) {
  return res.status(400).render("join", {
    pageTitle: PAGE_TITLE,
    errorMessage: "Confirmed Password does not match",
  }); /* status(400) 추가 */
}

const exists = await userModel.exists({ $or: [{ user_name }, { user_email }] });

if (exists) {
  return res.status(400).render("join", {
    pageTitle: PAGE_TITLE,
    errorMessage: "This user name/email already exists",
  }); /* status(400) 추가 */
}
```

```javascript
// videoController.js

if (!video) {
  return res.render("404", { pageTitle: "404 Not Found" });
}

// ...

export const postUploadVideo = async (req, res) => {
  const { vlog_title, vlog_desc, hashtags } = req.body;

  try {
    await videoModel.create({
      vlog_title,
      vlog_desc,
      hashtags: videoModel.formatHashtags(hashtags),
    });

    return res.redirect("/");
  } catch (err) {
    return res.status(400).render("upload", {
      pageTitle: "Upload your video",
      errMessage: err._message,
    });
  }
};
```
