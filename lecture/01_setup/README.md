## Before the project starts.........

- node.js / npm 설치

### express 설치

```bash
npm i express
```

### babelio.js

- 해당 사이트 : https://babeljs.io/ 에서 setup에서 확인 가능

```bash
npm install --save-dev @babel/core
```

- babel.config.json 파일 생성

```bash
npm install @babel/preset-env --save-dev
```

```json
{
  "presets": ["@babel/preset-env"]
}
```

- nodemon 설치

```bash
npm install @babel/node --save-dev
npm i nodemon --save-dev
```

- package.json 파일중 scripts에 해당 명령어를 적고 `npm run dev` 실행하면 nodemon 실행

```json
  "scripts": {
    "dev": "nodemon --exec babel-node index.js"
  },
```
