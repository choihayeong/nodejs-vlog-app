# Database : MongoStore

- [npm: express-session](https://www.npmjs.com/package/express-session)

  - session ID는 쿠키에 저장하지만 데이터 자체는 서버에 저장

  - 서버에 저장되는 default session storage는 `MemoryStore`이고 실제 사용하기 위해 있는 것이 아니라서 session stores를 사용해야 함.

    - => 세션을 database에 저장 [compatible session stores](https://www.npmjs.com/package/express-session#compatible-session-stores)

    - 따라서 `connect-mongo`를 이용해서 세션을 mongoDB에 저장

  ```
  Note) Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.

  Warning) The default server-side session storage, MemoryStore, is purposely not designed for a production environment.

  For a list of stores, see compatible session stores.
  ```

- `connect-mongo` 패키지 설치 및 `server.js`에 임포트

```bash
npm install connect-mongo
```

```javascript
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo"; // MongoStore 추가

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/vlog-app",
    }), // 추가
  }),
);
```

- `npm run dev` 후 커맨드 창에서 순서대로 실행한 후 vlog-app DB에 sessions 테이블이 생성된 것을 확인할 수 있음

```bash
mongod

mongosh

show dbs

use vlog-app

show collections
```

```bash
# result
vlog-app> show collections
sessions
users
videos
```

- sessions은 브라우저가 backend 서버를 방문할 때 만들어짐 `http://localhost:3030/` 으로 접속하고 커맨드창에 `db.sessions.find()`를 입력하면 다음과 같은 결과가 나온다.
  
  * 로그인 후 서버 종료 후 재 접속하면 다시 로그인 되어 있는 상태로 나온다.
    
  ![image](https://github.com/user-attachments/assets/00f5d465-1b88-4558-944e-ee120247d64a)

