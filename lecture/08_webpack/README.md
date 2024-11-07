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
