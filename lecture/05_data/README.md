# Database

## Dummy Data

- video 더미 데이터들을 다음과 같이 활용

```javascript
// videoController.js
const videos = [
  {
    title: "Welcome :)",
    rating: 4,
    comments: 2,
    createdAt: "2 Minutes Ago",
    views: 1000,
    idx: 1,
  },
  {
    title: "#2 Video",
    rating: 4,
    comments: 2,
    createdAt: "2 Minutes Ago",
    views: 999,
    idx: 2,
  },
  {
    title: "Whatups",
    rating: 4,
    comments: 2,
    createdAt: "2 Minutes Ago",
    views: 1,
    idx: 3,
  },
];

// ...
export const getVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
```

- 마크업 템플릿 `watch.pug`에서 다음과 같이 작성할 수 있다. `video` 더미 데이터 중 id값에 맞는 비디오 데이터들을 보여줄 수 있음.

```pug
//- watch.pug
block content
  h3 #{video.views} #{video.views === 1 ? "view" : "views"}
  a(href=`${video.idx}/edit`) Edit Video &rarr;
```

## form : POST Method

- `videoController.js`에서 edit 페이지를 렌더링 하는 함수를 다음과 같이 작성

```javascript
export const getEditVideo = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];

  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
```

- `edit.pug`에서 form 태그를 다음과 같이 활용하고 method는 `POST` 방식

```pug
block content
  h4 Change Title of Video
  form(method="POST")
    input(name="title", placeholder="Video Title", type="text", value=video.title, required)
    input(value="Save", type="submit")
```

- `videoRouter.js`에 edit 페이지와 같은 url의 post 메서드를 하나 추가 함

```javascript
// videoRouter.js
videoRouter.post("/:id(\\d+)/edit", postEditVideo);
```

- `videoController.js`에 `postEditVideo` 함수 추가

```javascript
// videoController.js
export const postEditVideo = (req, res) => {};
```
