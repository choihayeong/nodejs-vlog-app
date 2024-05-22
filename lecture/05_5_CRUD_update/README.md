# Database : CRUD

> Create - Read - Update - Delete

## Update

### `getEditVideo` 수정

- CRUD 중 READ 역할을 하는 `getVideo`와 마찬가지로 `video` 변수 값이 `null`일 경우 404 페이지로 렌더링 되도록 수정

```javascript
export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);

  return res.render("edit", {
    pageTitle: `Editing: ${video.vlog_title}`,
    video,
  });
};
```

### `postEditVideo` 수정

- STEP 1 : Edit 기능을 동작하기 위해 일단 다음과 같이 작성

```javascript
export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  const { vlog_title, vlog_desc, hashtags } = req.body;

  if (!video) {
    return res.render("404", { pageTitle: "404 Not Found" });
  }

  video.vlog_title = vlog_title;
  video.vlog_desc = vlog_desc;
  video.hashtags = hashtags
    .split(",")
    .map((item) => (item.startsWith("#") ? item : `#${item}`));

  await video.save();

  return res.redirect(`/videos/${id}`);
};
```

#### `Model.findByIdAndUpdate()`

- `postEditVideo` 중 아래 부분을 삭제하고 findByIdAndUpdate()를 적용

```javascript
video.vlog_title = vlog_title;
video.vlog_desc = vlog_desc;
video.hashtags = hashtags
  .split(",")
  .map((item) => (item.startsWith("#") ? item : `#${item}`));

await video.save();
```

```javascript
export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  const { vlog_title, vlog_desc, hashtags } = req.body;

  if (!video) {
    return res.render("404", { pageTitle: "404 Not Found" });
  }

  await videoModel.findByIdAndUpdate(id, {
    vlog_title,
    vlog_desc,
    hashtags: hashtags
      .split(",")
      .map((item) => (item.startsWith("#") ? item : `#${item}`)),
  });

  return res.redirect(`/videos/${id}`);
};
```

#### `Model.exists()`

- `findById()`와의 차이점은 `exists()`는 filter를 리턴한다는 점이다.

```javascript
export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.exists({ _id: id }); /* 해당부분 수정 */
  const { vlog_title, vlog_desc, hashtags } = req.body;

  // ...
};
```

#### After that refactoring

- [refactor README](https://github.com/choihayeong/nodejs-vlog-app/tree/main/lecture/05_2_mongo_DB#refactor)
