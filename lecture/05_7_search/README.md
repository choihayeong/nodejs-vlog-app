# Database : Search

- `globalRouter.js` 에서 `search` 페이지에 대해서 정의

```javascript
/* globalRouter.js */
import { home, searchVideo } from "../controller/videoController";

const globalRouter = express.Router();

globalRouter.get("/search", searchVideo);
```

- `globalRouter.js`에 임포트 된 `searchVideo` 함수를 `videoController.js`에서 다음과 같이 `search` 페이지를 렌더링

```javascript
/* videoController.js */

export const searchVideo = (req, res) => {
  return res.render("search");
};
```

- `/search` 페이지 pug 템플릿 생성

```pug
extends base

block content
  form(method="get")
    input(type="text", name="keyword", placeholder="Search By title")
    input(type="submit", value="Search Now")
```

- `req.query`를 이용하여 keyword 변수 할당

```javascript
/* videoController.js */

export const searchVideo = (req, res) => {
  const { keyword } = req.query;

  if (keyword) {
    // Search videos
  }

  return res.render("search", { pageTitle: "Search Video" });
};
```

### `$regex` Operator

- [$regex Operator](https://www.mongodb.com/docs/manual/reference/operator/query/regex/)

- `Model.find()`를 이용하여 검색 작업 수행

```javascript
export const searchVideo = async (req, res) => {
  const { keyword } = req.query;

  let videos = [];

  if (keyword) {
    videos = await videoModel.find({
      vlog_title: keyword,
    });
  }

  return res.render("search", { pageTitle: "Search Video", videos });
};
```

- `$regex` 정규식을 이용하여 한 단어만 검색해도 해당 제목이 포함된 비디오 모두 나오게 적용

```javascript
export const searchVideo = async (req, res) => {
  const { keyword } = req.query;

  let videos = [];

  if (keyword) {
    videos = await videoModel.find({
      vlog_title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
  }

  return res.render("search", { pageTitle: "Search Video", videos });
};
```

- `/search` 페이지 pug 템플릿 다음과 같이 렌더링 (`mixins/video` 추가)

```pug
extends base
include mixins/video

block content
  form(method="get")
    input(type="text", name="keyword", placeholder="Search By title")
    input(type="submit", value="Search Now")

  div
    each video in videos
      +video(video)
```
