# Environment Variables(환경변수)

- 파일구조 : `.env` 파일 생성

```
/(root)
└ src 📂
  .env
  .gitignore
  .babel.config.json
  .package.json
```

```.env
COOKIE_SECRET=AAAA
DB_URL=mongodb://127.0.0.1:27017/vlog-app
```

- `npm i dotenv` 패키지 추가 (https://www.npmjs.com/package/dotenv)

```bash
npm i dotenv
```

- `src/init.js`에 다음을 추가

```javascript
import "dotenv/config"; // 해당 부분 추가

import "./db";
import "./models/Video";
import "./models/User";
import "./models/Member";
import app from "./server";

// ...
```
