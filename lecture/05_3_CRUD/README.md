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
