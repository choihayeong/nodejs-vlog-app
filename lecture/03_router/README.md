## Introduction to express

### Router

MVC패턴 중 Model에 속하는 데이터

- <b>비디오</b>와 <b>유저</b> => 프로젝트의 도메인

- 도메인의 url 디자인 (라우터를 도메인별로 나눔)

```
/ -> home
/join -> 회원가입
/login -> 로그인
/search -> 검색

/users/join
/users/login
/users/edit -> 유저 정보 수정
/users/delete -> 유저 정보 삭제

/videos/search
/videos/watch
/videos/edit
/videos/delete

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
