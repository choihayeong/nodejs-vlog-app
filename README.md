# nodejs-vlog-app

nodejs-vlog-app built using node.js, express, no-sql based database(mongoDB) and ES6

## 📝 Note List

- [Wiki](https://github.com/choihayeong/nodejs-vlog-app/wiki)

## 의존 패키지 (`package.json`)

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "connect-mongo": "^5.1.0",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "express-session": "^1.18.0",
    "mongoose": "^8.3.4",
    "morgan": "^1.10.0",
    "prettier": "^3.2.5",
    "pug": "^3.0.2"
  },
  "devDependencies": {
    "@babel/core": "^7.22.5",
    "@babel/node": "^7.22.5",
    "@babel/preset-env": "^7.22.5",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.2",
    "nodemon": "^3.1.0"
  }
}
```

### Design for domain url

```
/ -> home
/join -> 회원가입
/login -> 로그인
/search -> 검색

/users/join
/users/login
/users/logout
/users/:id -> See User
/users/edit -> Edit My Profile
/users/delete -> Delete My Profile

/videos/search
/videos/:id -> See video
/videos/:id/edit -> Edit Video
/videos/:id/delete -> Delete Video
/videos/upload -> Upload Video

/videos/comments
/videos/comments/delete
```
