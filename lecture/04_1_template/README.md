# Template Engine

express로 쓰는 템플릿 엔진으로는 ejs, pug 등이 있음

## Setting

- pug 설치

```bash
npm i pug
```

- `server.js`에 다음을 추가 [express 공식문서](https://expressjs.com/en/5x/api.html#app.set)

```javascript
// ...
const app = express();
const logger = morgan("dev");

// 아래 두 줄 부분 추가
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
```

- src 폴더에 하위 폴더로 views 폴더 추가 후 `home.pug` 파일 생성

```pug
doctype html
html(lang="ko")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title vlog app
  body
    h1 Welcome Stranger :P
    footer &copy; 2024 VlogApp
```

- home이 보이고자 하는 컨트롤러에 다음과 같이 렌더링

```javascript
// videoController.js

export const trending = (req, res) => res.render("home");
```

## Extending Templates : Inheritance

- `views/base.pug` 파일 생성

  - 반복되는 레이아웃을 형성하는 `base.pug` 파일을 다음과 같이 작성한다. 바꿔야 되는 부분은 `block content` 부분을 이용함.

  - [pug 공식문서](https://pugjs.org/language/inheritance.html)

```pug
//- base.pug
doctype html
html(lang="ko")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    block title
  body
    block content
  include partials/footer.pug
```

```pug
//- home.pug
extends base.pug

block title
  title Home | easy-vlog

block content
  h1 Home!
```

```pug
//- watch.pug
extends base.pug

block title
  title Watch | easy-vlog

block content
  h1 Watch This Video
```

## Variables to Templates

- pug 파일 내에 `#{variable}` 모양으로 변수를 만들수 있음

```pug
doctype html
html(lang="ko")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title #{pageTitle} | Easy-Vlog
  body
    block content
  include partials/footer.pug
```

- `controller.js` 파일에서 해당 변수의 값을 보낼 수 있다.

```javascript
export const trending = (req, res) => res.render("home", { pageTitle: "Home" });

export const getVideo = (req, res) => {
  const { id } = req.params;

  return res.render("watch", { serialNumber: id });
};
```

### 참고링크 🔗

- [pug 공식문서](https://pugjs.org/api/getting-started.html)
