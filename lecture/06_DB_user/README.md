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
