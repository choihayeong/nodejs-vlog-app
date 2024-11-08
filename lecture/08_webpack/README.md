# Webpack

## Setting

```bash
npm i webpack webpack-cli --save-dev
```

- `webpack.config.js` 파일 생성

> entry와 output 속성이 있어야한다.

```js
module.exports = {
  entry: "",
  output: "",
};
```

- `/src` 내 `client/js` 폴더 생성 후 `main.js` 파일 생성 후 `webpack.config.js` 다음과 같이 작성

```javascript
// main.js
const hello = async () => {
  const x = await fetch("");
};

hello();
```

- `output`의 `path`는 절대경로로 작성을 해줘야한다.

```js
const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "statics", "js"),
  },
};
```

- `package.json`에 `"scripts"` 속성 내 다음을 추가

```json
{
  "scripts": {
    "build": "webpack --config webpack.config.js"
  }
}
```

### `rules`

- `babel-loader` 설치

```bash
npm i babel-loader --save-dev
```

### `mode`

- 기본값은 `"production"` 모드로 설정됨

### rendering

- `server.js`에서 다음과 같이 작성해줌

```javascript
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/statics", express.static("statics")); // 추가
// ...
```

```pug
doctype html
html(lang="ko")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title #{pageTitle} | #{siteName}
    link(rel="stylesheet", href="https://unpkg.com/mvp.css")
  body
    //- 하단 script 추가

    script(src="/statics/js/main.js")
```

### scss

- `/src/client/` 내에 `scss` 폴더 생성 후 `_variables.scss`, `style.scss` 파일 생성

```scss
// _variables.scss

$point--color: #abcedc;
```

```scss
// style.scss

@import "./variables";

body {
  background-color: $point--color;
}
```

- `sass-loader`, `sass`, `css-loader`, `style-loader` 패키지 설치

```bash
npm i sass-loader sass css-loader style-loader --save-dev
```

- `webpack.config.js` 파일에 다음과 같이 작성

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

- `/src/client/js/main.js`를 다음과 같이 작성

```javascript
import "../scss/style.scss";

console.log("aaa");
```

- 이후 `npm run build` 명령어를 실행하면 스타일 적용이 됨

### MiniCssExtractPlugin

- [docs](https://webpack.js.org/plugins/mini-css-extract-plugin/)

```bash
npm install --save-dev mini-css-extract-plugin
```

### `webpack.config.js` 개선

> webpack이 실행될 때마다 nodemon이 재시작하는 것을 고쳐야 함

- `nodemon.json` 파일 생성

```json
{
  "ignore": ["webpack.config.js", "src/client/*", "assets/*"],
  "exec": "babel-node src/init.js"
}
```

- `package.json` 파일 `"scripts"` 속성 수정

```json
{
  "scripts": {
    "dev": "nodemon",
    "build": "webpack",
    "prepare": "husky"
  }
}
```
