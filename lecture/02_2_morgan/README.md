## Introduction to express

### morgan 설치

- <a href="https://www.npmjs.com/package/morgan" target="_blank">npm morgan</a>

```bash
npm i morgan
```

- morgan을 이용하면 터미널에 method, path status code 등을 불러와서 확인이 가능함. (dev)

```javascript
const loggerMiddleware = morgan("dev");
```

```bash
GET /login 304 2.559 ms - -
```

- dev 자리에 combined를 쓰면 사용중인 브라우저, os 등이 나옴.

```javascript
const loggerMiddleware = morgan("combined");
```

```bash
::1 - - [14/Jul/2023:09:05:25 +0000] "GET /login HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
```
