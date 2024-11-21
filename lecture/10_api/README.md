# api

## Register View Controller

> template을 렌더링 하지 않는 views를 만듬

- `/src/routers/` 폴더 내 `apiRouter.js`를 만든다.

```javascript
import express from "express";

const apiRouter = express.Router();

export default apiRouter;
```

```javascript
// server.js

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter); // 추가
```

- `/src/controller/videoController.js` 파일 내 `registerView` 메서드 추가

```javascript
// /src/controller/videoController.js

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await VideoColorSpace.findById(id);

  if (!video) {
    return res.status(404);
  }

  video.meta.views = video.meta.views + 1;
  await video.save();

  return res.status(200);
};
```

```javascript
// /src/router/apiRouter.js

import express from "express";
import { registerView } from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

export default apiRouter;
```

### front-end rendering

- `/src/views/watch.pug`에 `input(type="hidden", value=video._id)#videoId`을 추가함

```pug
extends base

block content
  div#videoContainer.video-container
    input(type="hidden", value=video._id)#videoId
```

- `/src/client/js/videoPlayer.js`에서 다음과 같이 작성

```javascript
const inputVideoId = document.getElementById("videoId");

const endedVideo = () => {
  const api_id = inputVideoId.value;

  fetch(`/api/videos/${api_id}/view`, {
    method: "POST",
  });
};

videoEl.addEventListener("ended", endedVideo);
```

### `sendStatus()`

- 위와 같이 작성후 비디오가 끝나는 시점에 조회수가 올라가야 하지만 개발자 도구(단축키 f12) Network 탭에서 view의 상태가 pending이 되어버림

  - 이를 위해서 `registerView` 메서드의 `status()` 부분을 `sendStatus()`로 바꿔주면 status 상태 코드가 200으로 뜨게 된다.

```javascript
// /src/controller/videoController.js

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await VideoColorSpace.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }

  video.meta.views = video.meta.views + 1;
  await video.save();

  return res.sendStatus(200);
};
```
