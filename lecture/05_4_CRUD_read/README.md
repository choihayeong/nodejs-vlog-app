# Database : CRUD

> Create - Read - Update - Delete

## Read

- `videoRouter.js`에서 아래 두 부분을 다음과 같이 수정해줌

  - upload 관련 함수를 위에 작성하고 정규식을 수정 (MongoDB의 id값이 24byte의 hexdecimal string 값이므로 `\\d+`에서 `[0-9a-f]{24}`로 작성)

```javascript
// AS-IS

videoRouter.get("/:id(\\d+)", getVideo);

videoRouter.route("/:id(\\d+)/edit").get(getEditVideo).post(postEditVideo);

videoRouter.route("/upload").get(getUploadVideo).post(postUploadVideo);
```

```javascript
// TO-BE

videoRouter.route("/upload").get(getUploadVideo).post(postUploadVideo); // upload 부분을 위로....

videoRouter.get("/:id([0-9a-f]{24})", getVideo);

videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEditVideo)
  .post(postEditVideo);
```

- `Model.findById(id)`

  - `videoController.js`에서 `getVideo`함수를 다음과 같이 작성

```javascript
export const getVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);

  return res.render("watch", {
    pageTitle: video.vlog_title,
    video,
  });
};
```

- template (`watch.pug`, `edit.pug`)

```pug
//- watch.pug
extends base

block content
  p=video.vlog_desc
  small=video.published_date
  hr
  a(href=`${video.id}/edit`) Edit Video &rarr;
```

```pug
//- edit.pug
extends base.pug

block content
  h4 Change Title of Video
  form(method="POST")
    input(type="text", name="vlog_title", placeholder="Video Title", value=video.vlog_title, required)
    input(type="text", name="vlog_desc", minlength=30, placeholder="description", value=video.vlog_desc, required)
    input(type="text", name="hashtags", placeholder="Hashtags, seperated by comma.", value=video.hashtags.join(), required)
    input(value="Save", type="submit")
```

### 404 페이지 추가

- `videoController.js`에서 `getVideo`에서 `video`의 값이 `null`일 경우 404 페이지로 렌더링 하도록 수정

  - `src/views/` 폴더 내 `404.pug` 파일 생성 후 다음과 같이 작성

  ```pug
  extends base
  ```

```javascript
export const getVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);

  if (!video) {
    return res.render("404", { pageTitle: "404 Not Found" });
  }

  return res.render("watch", {
    pageTitle: video.vlog_title,
    video,
  });
};
```

### etc.

- `base.pug` 파일 중 nav에 Home으로 돌아가는 부분 추가

```pug
doctype html
html(lang="ko")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title #{pageTitle} | Easy-Vlog
    link(rel="stylesheet", href="https://unpkg.com/mvp.css")
  body
    header
      h1=pageTitle
      nav
        ul
          li
            a(href="/videos/upload") Upload Video
          li
            a(href="/") Home
    main
      block content
  include partials/footer
```
