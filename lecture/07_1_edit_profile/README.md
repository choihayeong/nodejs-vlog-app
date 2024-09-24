# Edit User Profile

>

<hr />

### Protector and Public Middlewares

- 로그인 되어 있는 유저들만 logout 페이지로 갈 수 있어야함. `userRouter.js`에서 다음을 추가해 준다.

```javascript
userRouter.get("/logout", protectorMiddleware, logout);
```
