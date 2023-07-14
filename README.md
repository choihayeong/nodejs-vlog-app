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
const handleListening = () => console.log("Server Listening on port 8080");

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

### middleware 
- middleware란 MVC 패턴 중 controller를 의미할 수 있음
```javascript
const handleHome = (req, res, next) => {
    next();
}
```
```javascript
const logger = (req, res, next) => {
    console.log("I'm in the middle!");
    next();
}
app.get("/", logger, handleHome);
```
- middleware는 request에 응답하는게 아니라 request를 지속시키는 역할을 함. 즉 응답하는 method가 아니라, 작업을 다음 method에 넘기는 역할을 함.
- 아래는 handleHome을 호출시키지 않고 logger를 호출하고 끝남.
```javascript
const logger = (req, res, next) => {
    return res.send("I have the power now!");
    next();
}

const handleHome = (req, res) => {
    return res.send("Here is middlewares.........");
}

app.get("/", logger, handleHome);
```
- middleware는 웹사이트의 어디를 가려는지 알려줌
- 아래는 request object를 통해 request.url을 콘솔에 출력함.
```javascript
const logger = (req, res, next) => {
    console.log(`Someone is going to : ${req.url}`);
    next();
}
app.get("/", logger, handleHome);
```
- middleware는 여러 개 쓸 수 있다. 
- 다음은 methodLogger를 실행 후 ```next();``` 다음 routerLogger가 실행 및 return 되면서 handleHome은 사용하지 않게 된다.
```javascript
const methodLogger = (req, res, next) => {
    next();
}
const routerLogger = () => {
    return res.send("www");
}

app.get("/", methodLogger, routerLogger, handleHome);
```

### app.use()
- global middleware를 만들 수 있게 함. use()다음 get()이 와야 한다.
```javascript
app.use(logger);
app.get("/", handleHome);
```
- before refactoring : 다음의 코드를 ```app.use()```로 간결하게 바꿀 수 있음.
```javascript
app.get("/", methodLogger, routerLogger, handleHome);
app.get("/login", methodLogger, routerLogger, handleHome);
```
- after refactoring : 순서 중요*
```javascript
app.use(methodLogger, routerLogger);
app.get("/", handleHome);
app.get("/login", handleLogin);
```