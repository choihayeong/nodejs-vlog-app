# Database : users

## Router (`/login` 페이지 생성)

- `userController.js` 와 `rootRouter.js`를 다음과 같이 추가

```javascript
// userController.js

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  // check if account exists

  // check if password correct
  res.end();
};
```

```javascript
// rootRouter.js
import express from "express";

import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controller/userController";
import { home, searchVideo } from "../controller/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin); /* 해당 부분 추가 */
rootRouter.get("/search", searchVideo);

export default rootRouter;
```

- `login.pug` 템플릿 생성

```pug
extends base

block content
  if errorMessage
    span=errorMessage
  form(method="post")
    input(type="text", name="user_name", placeholder="your unique name", required)
    input(type="password", name="user_password", placeholder="your password", required)
    input(type="submit" value="Login")
  hr
  div
    span Don't have any Account?
    a(href="/join") Create One Now &rarr;
```
