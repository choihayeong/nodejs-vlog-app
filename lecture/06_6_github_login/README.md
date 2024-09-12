# Github Login

## Setting

- https://github.com/settings/apps 으로 들어가서 `OAuth Apps`를 클릭 후 Register a new OAuth Application

## Step 01 : Github ID 요청

- github ID 로그인 리다이렉트 url

```
GET https://github.com/login/oauth/authorize
```

- `login.pug`에 다음을 추가

```pug
extends base

block content
    if errorMessage
        span=errorMessage
    form(method="post")
        input(type="text", name="user_name", placeholder="your unique name", required)
        input(type="password", name="user_password", placeholder="your password", required)
        input(type="submit" value="Login")
        br
        //- Continue with GitHub 추가
        a(href="https://github.com/login/oauth/authorize?client_id=") Continue with GitHub &rarr;
```

- 매개변수를 다음과 같이 추가할 수 있음

```pug
a(href="https://github.com/login/oauth/authorize?client_id=Ov23lio3vysGH7WwrWv2&allow_signup=fasle&scope=read:user%20user:email") Continue with GitHub &rarr;
```

- 매우 긴 url 이므로 express route로 가공을 해줌

```pug
a(href="/users/github/start") Continue with GitHub &rarr;
```

```javascript
// src/router/userRouter.js

userRouter.get("/github/start", startGithubLogin);
```

- .env 파일에 다음을 추가

```.env
GH_CLIENT=Ov23lio3vysGH7WwrWv2
```

```javascript
// src/controller/userController.js

export const startGithubLogin = (req, res) => {
  const BASE_URL = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const CUSTOM_URL = `${BASE_URL}?${params}`;

  return res.redirect(CUSTOM_URL);
};
```

- 해당 페이지 진입시 Authorize를 누르면 OAuth Setting 페이지에서 `Authorize callback URL`에 적혀있는 곳으로 리다이렉트 됨

## Step02 : 유저를 사이트로 리디렉션

```
POST https://github.com/login/oauth/access_token
```

- .env 파일에 다음을 추가

```.env
GH_CLIENT=Ov23lio3vysGH7WwrWv2
GH_SECRET=
```

```javascript
// src/router/userRouter.js

userRouter.get("/github/finish", finishGithubLogin);
```

```javascript
// src/controller/userController.js

export const finishGithubLogin = async (req, res) => {
  const BASE_URL = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const CUSTOM_URL = `${BASE_URL}?${params}`;
  const data = await fetch(CUSTOM_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();

  console.log(json);
};
```

#### References

- [Github Developers Docs](https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)

- [Github Developers Docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)

- [MDN : URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
