# Database : CRUD

> Create - Read - Update - Delete

## Introduction

- `src/models` 폴더 생성 후 `Video.js`파일 생성

```javascript
import mongoose from "mongoose";

// model의 형태 => schema(스키마)를 정의
const videoSchema = new mongoose.Schema({
  vlog_title: String,
  vlog_desc: String,
  published_date: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const movieModel = mongoose.model("Video", videoSchema);

export default movieModel;
```

- `server.js`에 다음과 같이 임포트

```javascript
import express from "express";
import morgan from "morgan";

import "./db";
import "./models/Video"; // 해당 부분 추가

// ...
```

- `src/init.js` 파일 생성 (refactoring)

> `server.js`에 있는 내용을 `init.js`로 정리

```javascript
import "./db";
import "./models/Video";
import app from "./server";

const PORT = 8080;

const handleListening = () =>
  console.log(`✅ Server Listening on port http://localhost:${PORT} 😎`);

app.listen(PORT, handleListening);
```

> 최종 `server.js`코드

```javascript
import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app; // 해당 부분 추가
```

> `package.json` 파일 내 scripts 부분 중 `src/server.js`을 `src/init.js`로 변경

```json
  "scripts": {
    "dev": "nodemon --exec babel-node src/init.js",
  },
```

## Query

- `videoController.js`에서 `src/models/Video.js`를 불러옴 home 함수를 다음과 같이 작성

```javascript
import videoModel from "../models/Video";

export const home = (req, res) => {
  videoModel.find({}).then(handleSearch);

  return res.render("home", { pageTitle: "Home", videos: [] });
};

// ...
```

> `videoModel.find({}, cb())`로 작성 시 다음과 같은 오류가 나므로 위와 같이 작성해줘야함. <br /> [참고링크](https://nomadcoders.co/wetube/lectures/2675/comments/128062)

```
MongooseError: Model.find() no longer accepts a callback
```

### Async/Await

```javascript
export const home = async (req, res) => {
  // videoModel.find({}).then(handleSearch);

  console.log("top");

  const videos = await videoModel.find({});

  console.log("middle");

  console.log(videos);

  return res.render("home", { pageTitle: "Home", videos: [] });
};
```

- 기존의 비동기 방식을 다음과 같은 async/await 형식으로 작성 하면 콘솔에는 다음과 같은 순서로 나옴

```
top
middle
[] <- videos
```

- `try/catch`로 오류 캐치

```javascript
export const home = async (req, res) => {
  // videoModel.find({}).then(handleSearch);

  try {
    console.log("top");
    const videos = await videoModel.find({});
    console.log(videos);
    console.log("finished");
    return res.render("home", { pageTitle: "Home", videos: [] });
  } catch {
    return res.send("server error");
  }
};
```

- 터미널 콘솔은 다음과 같다.

```
top
[] <- videos
finished
```

### Conclusion

- `videoController.js`에서 home화면으로 렌더링하는 Controller의 쿼리문을 다음과 같이 정리

```javascript
export const home = async (req, res) => {
  const videos = await videoModel.find({});

  return res.render("home", { pageTitle: "Home", videos });
};
```

## Create

- 데이터를 생성 (1) : `videoController.js`에서 upload video를 할 때를 보면 된다.

```pug
//- upload.pug
extends base

block content
	form(method="post")
		input(type="text", name="vlog_title", placeholder="title", required)
		input(type="text", name="vlog_desc", placeholder="description", required)
		input(type="text", name="hashtags", placeholder="Hashtags, seperated by comma.", required)
		input(type="submit", value="Upload")
```

```javascript
// videoController.js
export const postUploadVideo = async (req, res) => {
  const { vlog_title, vlog_desc, hashtags } = req.body;

  const newVideo = new videoModel({
    vlog_title,
    vlog_desc,
    published_date: Date.now(),
    hashtags: hashtags.split(",").map((item) => `#${item}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });

  console.log(newVideo);

  await newVideo.save();

  return res.redirect("/");
};
```

- 다음과 같은 콘솔 결과를 볼 수 있다. `_id` 값은 mongoose에서 부여해준 값.

```bash
{
  vlog_title: 'Hi there 🖐️' ,
  vlog_desc: 'This is wetube',
  published_date: 2024-05-13T04:58:17.555Z,
  hashtags: [ '#vlog', '#nodejs', '#app' ],
  meta: { views: 0, rating: 0 },
  _id: new ObjectId('66419de9fa793174d0d34a09')
}
```

### Command Prompt

- 윈도우 커맨드 창에서 mongosh를 실행 후 `show dbs`를 실행하면 `vlog-app` db가 생성된 것을 볼 수 있다.

  ![image](https://github.com/choihayeong/nodejs-vlog-app/assets/90609686/bb49b863-1653-462b-933b-77f01ec1d9f7)

- `use vlog-app`을 커맨드 창에 실행하면 `switched to db vlog-app`이라는 결과가 뜬다.

  ![image](https://github.com/choihayeong/nodejs-vlog-app/assets/90609686/1d21fc0a-0517-4af6-8b0e-d2d9ab601ec3)

- `show collections`를 실행하면 `videos` 라는 db의 document중 하나가 있다는 것을 볼 수 있다.

  ![image](https://github.com/choihayeong/nodejs-vlog-app/assets/90609686/0be0aa5b-488d-4368-8f2b-cb9a4a80097a)

- `db.videos.find()`를 실행하면 `videos` 라는 db의 document의 데이터를 확인할 수 있다. (sql의 SELECT 문과 비슷한 듯?)

  ![image](https://github.com/choihayeong/nodejs-vlog-app/assets/90609686/5129b087-a954-4fa1-8cda-35bd350326b7)

### `dbModel.Create({});`

- 데이터를 생성 (2) : `Create({})` 를 이용하여 다음과 같이 생성도 가능함.

```javascript
export const postUploadVideo = async (req, res) => {
  const { vlog_title, vlog_desc, hashtags } = req.body;

  await videoModel.create({
    vlog_title,
    vlog_desc,
    published_date: Date.now(),
    hashtags: hashtags.split(",").map((item) => `#${item}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });

  return res.redirect("/");
};
```

### `try/catch`

- validation 오류 등이 있을 경우 다음과 같이 `try/catch` 문으로 작성해준다.

```javascript
export const postUploadVideo = async (req, res) => {
  const { vlog_title, vlog_desc, hashtags } = req.body;

  try {
    await videoModel.create({
      vlog_title,
      vlog_desc,
      hashtags: hashtags.split(",").map((item) => `#${item}`),
    });

    return res.redirect("/");
  } catch (err) {
    return res.render("upload", {
      pageTitle: "Upload your video",
      errMessage: err._message,
    });
  }
};
```

- `Video.js`의 스키마를 구체적으로 정의해준다.

  - `required` 값을 정의해서 해당 값이 없을 경우 에러 메시지를 출력하게 할 수 있음.

  - `default` 값을 정의해 줄 수도 있다. `default` 값이 있으면 `required: true`를 작성하지 않아도 된다.

```javascript
const videoSchema = new mongoose.Schema({
  vlog_title: { type: String, required: true },
  vlog_desc: { type: String, required: true },
  published_date: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});
```
