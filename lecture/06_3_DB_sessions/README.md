# Database : Sessions & Cookies

## `express-session` 설치

- [npm: express-session](https://www.npmjs.com/package/express-session)

```bash
npm i express-session
```

- `server.js`에서 import

```javascript
import express from "express";
import morgan from "morgan";
import session from "express-session"; // 해당 부분 추가
```

- `server.js`에서 router 위에 세션 추가

```javascript
app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  }),
);
```
