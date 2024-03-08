## Router

### Router Architecture

MVC패턴 중 Model에 속하는 데이터를 다음과 같이 구성 (router는 MVC패턴 중 Controller라고 생각하면 됨)

- <b>비디오</b>와 <b>유저</b> => 프로젝트의 도메인

- 도메인의 url 디자인 (라우터를 도메인별로 나눔)

```
/ -> home
/join -> 회원가입
/login -> 로그인
/search -> 검색

/users/join
/users/login
/users/logout
/users/:id -> See User
/users/edit -> Edit My Profile
/users/delete -> Delete My Profile

/videos/search
/videos/:id -> See video
/videos/:id/edit -> Edit Video
/videos/:id/delete -> Delete Video
/videos/upload -> Upload Video

/videos/comments
/videos/comments/delete
```

### `server.js`에 적용

```javascript
const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", handleHome);

const userRouter = express.Router();

const handleEditUser = (req, res) => res.send("Edit User");

userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
```

### `server.js`에 적용한 코드를 정리

- src 폴더에 하위 폴더로 routers를 만들어 주고 그 아래 3개의 파일을 생성 (`globalRouter.js`, `userRouter.js`, `videoRouter.js`)

```
📁src
└ 📁routers
  └ globalRouter.js
  └ userRouter.js
  └ videoRouter.js
└ server.js
```

- routers 내 3개 파일 다음과 같이 작성 (아래는 globalRouter.js의 예시)

```javascript
import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", handleHome);

export default globalRouter;
```

- `server.js`에 다음과 같이 정리

```javascript
import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 8080;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () =>
  console.log(`✅ Server Listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);
```

### controller

- src 폴더에 하위 폴더로 controller를 만들어 주고 그 아래 2개의 파일을 생성 (`userController.js`, `videoController.js`)

```
📁src
└ 📁controller
  └ userController.js
  └ videoController.js
└ server.js
```

- controller 내 2개 파일 다음과 같이 작성

```javascript
// videoController.js
export const trending = (req, res) => res.send("Home page Videos");
export const watchVideo = (req, res) => res.send("Watch Video");
export const editVideo = (req, res) => res.send("Edit Video");
export const deleteVideo = (req, res) => res.send("Delete Video");
```

```javascript
// userController.js
export const join = (req, res) => res.send("Join");
export const editUser = (req, res) => res.send("Edit User Info");
export const deleteUser = (req, res) => res.send("Delete User");
```

- routers 파일 예시 : `globalRouter.js`에 다음과 같이 정리

```javascript
import express from "express";

import { join } from "../controller/userController";
import { trending } from "../controller/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);

export default globalRouter;
```

### URL parameters 와 정규식

- `/:id` 로 이용해서 parameter를 받을 수 있음

- parameter를 숫자로만 받고 싶을 경우 정규식을 이용해서 `/:id(\\d+)`로 작성하면 된다.

- [express routing](https://expressjs.com/en/guide/routing.html)

- [정규식 체크](https://regexr.com/)
