# nodejs-vlog-app

nodejs-vlog-app built using node.js, express, no-sql based database(mongoDB) and ES6

### 📝 Note List

- [Wiki](https://github.com/choihayeong/nodejs-vlog-app/wiki)

### 의존 패키지 (`package.json`)

```json
{
  "dependencies": {
    "@ffmpeg/core": "^0.12.6",
    "@ffmpeg/ffmpeg": "^0.12.10",
    "bcrypt": "^5.1.1",
    "connect-mongo": "^5.1.0",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "express-session": "^1.18.0",
    "mongoose": "^8.3.4",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "prettier": "^3.2.5",
    "pug": "^3.0.2",
    "regenerator-runtime": "^0.14.1"
  },
  "devDependencies": {
    "@babel/core": "^7.22.5",
    "@babel/node": "^7.22.5",
    "@babel/preset-env": "^7.22.5",
    "babel-loader": "^9.2.1",
    "css-loader": "^7.1.2",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.2",
    "mini-css-extract-plugin": "^2.9.2",
    "nodemon": "^3.1.0",
    "sass": "^1.80.6",
    "sass-loader": "^16.0.3",
    "style-loader": "^4.0.0",
    "webpack": "^5.96.1",
    "webpack-cli": "^5.1.4"
  }
}
```

### `npm run dev` 시작 전

- `.env` 파일 생성

```
COOKIE_SECRET=ejfowjofw
DB_URL=mongodb://127.0.0.1:27017/...
GH_CLIENT=
GH_SECRET=
```

### Design for domain url

```
/ -> home
/join -> 회원가입
/login -> 로그인
/search -> 검색

/users/:id -> See User
/users/edit -> Edit My Profile
[wip] /users/delete -> Delete User

/videos/upload -> Upload Video
/videos/:id -> See video
/videos/:id/edit -> Edit Video
/videos/:id/delete -> Delete Video

/videos/comments
/videos/comments/delete
```

### Design for API domain

> swagger ui 활용.....

- 비디오 조회수 카운트 : `/api/videos/:video_id/view` (POST)
- 비디오 삭제 : `/api/video/:video_id` (DELETE)
- 비디오 새 댓글 등록 : `/api/videos/:video_id/comment` (POST)
- 비디오의 해당 댓글 삭제 : `/api/comment/:comment_id/video/:video_id` (DELETE)
- 비디오의 댓글 모두 삭제 : `/api/video/:video_id/comments-all` (DELETE)

- 한 유저의 비디오 모두 삭제 : `/api/user/:user_id/videos-all` (DELETE)
- 한 유저의 비디오 목록 업데이트 : `/api/user/:user_id/videos` (PUT)
- 한 유저의 댓글 모두 삭제 : `/api/user/:user_id/comments-all` (DELETE)
