# Template Engine

express로 쓰는 템플릿 엔진으로는 ejs, pug 등이 있음

## Styles 적용 : MVP.css

- `base.pug`파일에 다음과 같이 임포트

```pug
//- base.pug
head
  //- ...
  link(rel="stylesheet", href="https://unpkg.com/mvp.css")
```

- 변수를 다음과 같이도 할당할 수 있음 (`h1=pageTitle`)

```pug
//- base.pug
body
  header
    h1=pageTitle
```

## Conditional

- [pug : conditional](https://pugjs.org/language/conditionals.html)

### 참고링크 🔗

- [MVP.css](https://andybrewer.github.io/mvp/)
