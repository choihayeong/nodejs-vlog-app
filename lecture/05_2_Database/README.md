# Database

> Mongo DB : document-based, 일반적으로 DB는 sql-based임. MongoDB는 Json 같은 문서형식으로 구성된 DB임.

### Installation

- [MongoDB Official Site](https://www.mongodb.com/)

- [Resources > Sever Documentation](https://www.mongodb.com/docs/manual/) : 왼쪽 탭 메뉴 중 `Installation` 중 `Install MongoDB Community Edition`을 클릭 (MacOS는 명령어로 쉽게 설치)

- [Window Download Center](https://www.mongodb.com/try/download/community) : WindowOS 설치

### Connecting to MongoDB

> WindowOS 기준

#### `mongod` 명령어

- 윈도우에서 `시스템 환경변수 편집`에 들어가서 오른쪽 하단 `환경 변수`로 들어간다.

- `user에 대한 사용자 변수`에서 Path를 클릭하고 편집을 누른다.

- 환경 변수 편집 창이 나오면 `새로 만들기`를 누르고 `C:\Program Files\MongoDB\Server\7.0\bin`를 입력 후 확인을 눌러준다.

- 커맨드 창에서 `mongod`를 치면 작동을 하게 됨.

#### `mongo` 명령어(or `mongosh`)

- [nomad coder 강의 내 댓글 참고](https://nomadcoders.co/wetube/lectures/2671/comments/112904)

  - [mongosh 별도 설치](https://www.mongodb.com/docs/mongodb-shell/) : 설치 후 bin 폴더 내의 파일들을 `C:\Program Files\MongoDB\Server\7.0\bin`에 옮기면 환경변수를 또 추가 안해도 된다고 함

- [mongod 명령어와 mongo 명령어의 차이](https://nomadcoders.co/wetube/lectures/2671/comments/75166)

  - `mongod` : MongoDB 시스템의 프로세서(like Server)

  - `mongo` : MongoDB에 대한 Shell Interface (like Client)

#### mongoose 설치

```bash
npm install mongoose
```

- `src/db.js` 파일 생성 : mongo DB에 연결해주기

```javascript
// db.js

import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/vlog-app");
```

- `src/server.js`에 다음과 같이 db.js를 임포트

```javascript
import express from "express";
import morgan from "morgan";

import "./db"; // 해당 부분 추가

// ...
```

- `src/db.js`에 다음과 같이 콘솔 확인

```javascript
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/vlog-app");

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (err) => console.log("❌ DB Error", err);

db.on("error", handleError);
db.once("open", handleOpen);
```

### Middlewares

- Mongoose에서 middlewares란 request 중간에 가로채서 뭔가를 실행하는 역할

  - [Mongoose에서 middlewares](https://mongoosejs.com/docs/middleware.html#pre)

- Mongoose에서 middlewares는 Model이 생성되기 전에 만들어야함

  - `src/models/Video.js` 에서 `const videoModel = mongoose.model("Video", videoSchema);` 전에 작성해준다.

  ```javascript
  // Middleware
  videoSchema.pre("save", async function () {
    this.hashtags = this.hashtags[0]
      .split(",")
      .map((item) => (item.startsWith("#") ? item : `#${item}`));
  });
  ```

### Refactor

- `src/models/Video.js` 에서 middleware의 hashtags 관련 함수를 따로 정의해줌

```javascript
import mongoose from "mongoose";

export const formatHashtags = (tags) =>
  tags.split(",").map((item) => (item.startsWith("#") ? item : `#${item}`));

const videoSchema = new mongoose.Schema({
  // ...
});
```

- `videoController.js`에서 위의 `formatHashtags`를 임포트 한다.

```javascript
import videoModel, { formatHashtags } from "../models/Video";

// ...

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.exists({ _id: id });
  const { vlog_title, vlog_desc, hashtags } = req.body;

  if (!video) {
    return res.render("404", { pageTitle: "404 Not Found" });
  }

  await videoModel.findByIdAndUpdate(id, {
    vlog_title,
    vlog_desc,
    hashtags: formatHashtags(hashtags) /* 해당 부분 수정 */,
  });

  return res.redirect(`/videos/${id}`);
};

// ...

export const postUploadVideo = async (req, res) => {
  const { vlog_title, vlog_desc, hashtags } = req.body;

  try {
    await videoModel.create({
      vlog_title,
      vlog_desc,
      hashtags: formatHashtags(hashtags) /* 해당 부분 수정 */,
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

#### Statics

- 위의 `src/models/Video.js`에서 `formatHashtags` 함수를 다시 정리

  - [mongoose static](<https://mongoosejs.com/docs/api/schema.html#Schema.prototype.static()>)

```javascript
import mongoose from "mongoose";

/* 아래 주석 처리된 부분 삭제 */
// export const formatHashtags = (tags) => tags.split(",").map((item) => item.startsWith("#") ? item : `#${item}`);

const videoSchema = new mongoose.Schema({
  // ...
});

/* 아래 부분 추가 */
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((item) => (item.startsWith("#") ? item : `#${item}`));
});

// ...
```

- `videoController.js`에서 다음과 같이 정리함

```javascript
import videoModel from "../models/Video";

// ...

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.exists({ _id: id });
  const { vlog_title, vlog_desc, hashtags } = req.body;

  if (!video) {
    return res.render("404", { pageTitle: "404 Not Found" });
  }

  await videoModel.findByIdAndUpdate(id, {
    vlog_title,
    vlog_desc,
    hashtags: videoModel.formatHashtags(hashtags) /* 해당 부분 수정 */,
  });

  return res.redirect(`/videos/${id}`);
};

// ...

export const postUploadVideo = async (req, res) => {
  const { vlog_title, vlog_desc, hashtags } = req.body;

  try {
    await videoModel.create({
      vlog_title,
      vlog_desc,
      hashtags: videoModel.formatHashtags(hashtags) /* 해당 부분 수정 */,
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

#### 템플릿 파일 정리 (`views/mixins/video.pug`)

```pug
mixin video(info)
  div
    h4
      a(href=`/videos/${info._id}`)=info.vlog_title
    p=info.vlog_desc
    ul
      each hashtag in info.hashtags
        li=hashtag
    small=info.published_date

  hr
```

##### 참고링크

- [npm : mongoose](https://www.npmjs.com/package/mongoose)

## MariaDB

- [MariaDB 설치](https://mariadb.org/download)

- [Heidi SQL 설치](https://www.heidisql.com/download.php)

- [github repository](https://github.com/choihayeong/easy-2-vlog?tab=readme-ov-file#easy_2_vlog)
