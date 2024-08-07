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

## logged In User

- 로그인한 브라우저에서의 세션 쿠키 1개

![image](https://github.com/user-attachments/assets/fa38da8d-de66-4459-87ff-93a27d2edc40)


- 다른 브라우저에서 세션 2개의 쿠키가 있음

![image](https://github.com/user-attachments/assets/7e537f8f-ab9e-4d4d-84d5-bde3636fb878)
