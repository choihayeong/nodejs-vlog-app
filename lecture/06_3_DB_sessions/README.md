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

- `server.js`에서 현재 세션 확인

```javascript
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions); // 세션의 id 확인
    next();
  });
});
```

- `/add-one` 이라는 url로 접속했을 때 새로고침하면 `rice` 값이 올라감

```javascript
app.get("/add-one", (req, res, next) => {
  req.session.rice += 1;

  return res.send(`${req.session.id} ${req.session.rice}`);
});
```

## logged In User

- `userController.js`에서 `postLogin`을 다음과 같이 처리

```javascript
export const postLogin = (req, res, next) => {
  // ...

  // 유저가 로그인 하면 그 유저에 대한 정보를 세션에 담음
  req.session.loggedIn = true;
  req.session.user = user_name;

  console.log("LOG MEMBER IN : COMING SOON!");
  res.redirect("/");
};
```

- 로그인한 브라우저에서의 세션 쿠키 1개

![image](https://github.com/user-attachments/assets/fa38da8d-de66-4459-87ff-93a27d2edc40)

- 다른 브라우저에서 세션 2개의 쿠키가 있음

![image](https://github.com/user-attachments/assets/7e537f8f-ab9e-4d4d-84d5-bde3636fb878)

- `base.pug`에 있는 네비게이션 처리

  - req.session.loggedIn === true 일 경우 네비게이션에 Join과 Login은 안보이게 처리
