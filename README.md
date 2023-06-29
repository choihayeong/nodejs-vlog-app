# nodejs-vlog-app
nodejs-vlog-app  built using node.js, express, mariadb and ES6

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
- package.json 파일중 scripts에 해당 명령어를 적고 ```npm run dev``` 실행하면 nodemon 실행
```json
  "scripts": {
    "dev": "nodemon --exec babel-node index.js"
  },
```

## Introduction to express
### request / responses
- src/server.js (localhost:8080 으로 접속하면 응답을 받을 수 있음)
```javascript
import express from "express";

const app  = express();
const handleListening = () => console.log("Server Listening on port 9030");

app.listen(8080, handleListening);
```
- package.json에 다음과 같이 수정
```json
  "scripts": {
    "dev": "nodemon --exec babel-node src/server.js"
  },
```
- request를 종료시키는 방법에는 res.end(), res.send("") 등이 있음 (src/server.js)
```javascript
const handleHome = (req, res) => {
    return res.end();
}

app.get("/", handleHome);
```
```javascript
const handleHome = (req, res) => {
    return res.send("I wanna go Home.......🏚");
}

app.get("/", handleHome);
```