# mongo DB

> document-based : 일반적으로 DB는 sql-based임. MongoDB는 Json 같은 문서형식으로 구성된 DB임.

## Installation

- [MongoDB Official Site](https://www.mongodb.com/)

- [Resources > Sever Documentation](https://www.mongodb.com/docs/manual/) : 왼쪽 탭 메뉴 중 `Installation` 중 `Install MongoDB Community Edition`을 클릭 (MacOS는 명령어로 쉽게 설치)

- [Window Download Center](https://www.mongodb.com/try/download/community) : WindowOS 설치

## Connecting to MongoDB

> WindowOS 기준

### `mongod` 명령어

- 윈도우에서 `시스템 환경변수 편집`에 들어가서 오른쪽 하단 `환경 변수`로 들어간다.

- `user에 대한 사용자 변수`에서 Path를 클릭하고 편집을 누른다.

- 환경 변수 편집 창이 나오면 `새로 만들기`를 누르고 `C:\Program Files\MongoDB\Server\7.0\bin`를 입력 후 확인을 눌러준다.

- 커맨드 창에서 `mongod`를 치면 작동을 하게 됨.

### `mongo` 명령어(or `mongosh`)

- [nomad coder 강의 내 댓글 참고](https://nomadcoders.co/wetube/lectures/2671/comments/112904)

  - [mongosh 별도 설치](https://www.mongodb.com/docs/mongodb-shell/) : 설치 후 bin 폴더 내의 파일들을 `C:\Program Files\MongoDB\Server\7.0\bin`에 옮기면 환경변수를 또 추가 안해도 된다고 함

- [mongod 명령어와 mongo 명령어의 차이](https://nomadcoders.co/wetube/lectures/2671/comments/75166)

  - `mongod` : MongoDB 시스템의 프로세서(like Server)

  - `mongo` : MongoDB에 대한 Shell Interface (like Client)

### mongoose 설치

```bash
npm install mongoose
```

- `src/db.js` 파일 생성 : mongo DB에 연결해주기

```javascript
// db.js

import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/vlog-app");
```

- `src/server.js`에 다음과 같이 db.js를 임포트

```javascript
import express from "express";
import morgan from "morgan";

import "./db"; // 해당 부분 추가

// ...
```

- `src/db.js`에 다음과 같이 콘솔 확인

```javascript
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/vlog-app");

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (err) => console.log("❌ DB Error", err);

db.on("error", handleError);
db.once("open", handleOpen);
```

#### 참고링크

- [npm : mongoose](https://www.npmjs.com/package/mongoose)
