# nodejs-vlog-app

nodejs-vlog-app built using node.js, express, mariadb and ES6

## 📝 Note List

- <a href="https://github.com/choihayeong/nodejs-vlog-app/blob/main/lecture/01_setup/README.md">01_setup</a>
- <a href="https://github.com/choihayeong/nodejs-vlog-app/blob/main/lecture/02_1_express/README.md">02_1_express</a>
- <a href="https://github.com/choihayeong/nodejs-vlog-app/blob/main/lecture/02_2_morgan/README.md">02_2_morgan</a>
- <a href="https://github.com/choihayeong/nodejs-vlog-app/blob/main/lecture/03_router/README.md">03_router</a>

## 의존 패키지 (`package.json`)

```json
{
  "dependencies": {
    "express": "^4.18.2",
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
