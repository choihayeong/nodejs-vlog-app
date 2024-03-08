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

### 참고링크 🔗

- [pug 공식문서](https://pugjs.org/api/getting-started.html)
