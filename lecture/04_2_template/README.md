# Template Engine

express로 쓰는 템플릿 엔진으로는 ejs, pug 등이 있음

## Styles 적용 : MVP.css

- `base.pug`파일에 다음과 같이 임포트

```pug
//- base.pug
head
  //- ...
  link(rel="stylesheet", href="https://unpkg.com/mvp.css")
```

- 변수를 다음과 같이도 할당할 수 있음 (`h1=pageTitle`)

```pug
//- base.pug
body
  header
    h1=pageTitle
```

## Conditional

- [pug : conditional](https://pugjs.org/language/conditionals.html)

```javascript
// videoController.js
const fakeUser = {
  name: "Brooksy Eiffel",
  loggedIn: false,
};

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser });
```

```pug
//- base.pug
header
  if fakeUser.loggedIn
    small Hello #{fakeUser.userName}
  else
    small Hello Stranger
  nav
    ul
      if fakeUser.loggedIn
        li
          a(href="/logout") Log out
      else
        li
          a(href="/login") Login
```

## Iteration

- [pug : Iteration](https://pugjs.org/language/iteration.html)

- Basic Usage

```javascript
// videoController.js
export const trending = (req, res) => {
  const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return res.render("home", { pageTitle: "Home", videos });
};
```

```pug
//- home.pug
extends base

block content
  h2  Welcome here you can see trending videos
  ul
    each video in videos
      li=video
    else
      li Sorry, nothing found.
```

- Object Array

```javascript
// videoController.js
export const trending = (req, res) => {
  const videos = [
    {
      title: "Welcome :)",
      rating: 4,
      comments: 2,
      createdAt: "2 Minutes Ago",
      views: "1000",
      idx: 1,
    },
    {
      title: "#2 Video",
      rating: 4,
      comments: 2,
      createdAt: "2 Minutes Ago",
      views: "1000",
      idx: 2,
    },
    {
      title: "Whatups",
      rating: 4,
      comments: 2,
      createdAt: "2 Minutes Ago",
      views: "1000",
      idx: 3,
    },
  ];

  return res.render("home", { pageTitle: "Home", videos });
};
```

```pug
//- home.pug
extends base

block content
  h2  Welcome here you can see trending videos
  each video in videos
    div
      h4=video.title
      ul
        li #{video.rating} / 5
        li #{video.comments} comments.
        li Posted #{video.createdAt}.
        li #{video.views} views.
  else
    div Sorry, nothing found.
```

## Mixin

- [pug : mixins](https://pugjs.org/language/mixins.html)

- `src/views/` 하위 폴더 `mixins`를 만든다. 해당 폴더 안에 `video.pug` 파일을 추가

```pug
//- src/views/mixins/video.pug
mixin video(info)
  div
    h4=info.title
    ul
      li #{info.rating} / 5
      li #{info.comments} comments.
      li Posted #{info.createdAt}.
      li #{info.views} views.
```

- `home.pug` 파일에 다음과 같이 작성

```pug
//- src/views/home.pug
extends base
include mixins/video

block content
  h2 Welcome here you can see trending videos
  each item in videos
    +video(item)
  else
    div Sorry, nothing found.
```

### 참고링크 🔗

- [MVP.css](https://andybrewer.github.io/mvp/)
