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

- template (`watch.pug`)

```pug
extends base

block content
  p=video.vlog_desc
  small=video.published_date
  hr
  a(href=`${video.id}/edit`) Edit Video &rarr;
```
