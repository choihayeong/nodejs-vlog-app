# Recorder Video

- `/src/client/js/` 폴더 내 `recorders.js` 파일 생성

- `webpack.config.js`에 다음을 추가

```js
module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    recorders: "./src/client/js/recorders.js", // 추가
  },
};
```

- `/src/views/upload.pug` 에서 녹화 버튼 및 스크립트 추가

```pug
extends base

block content
	div
		button#recordBtn Start Record

    //- ...

block scripts
	script(src="/statics/js/recorders.js")

```

- `navigator.mediaDevices.getUserMedia()` 메서드를 이용

  - 참고 링크 : [MediaDevices: getUserMedia() method](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

```javascript
const recordBtnEl = document.getElementById("recordBtn");

const startRecord = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
};

recordBtnEl.addEventListener("click", startRecord);
```

- 여기서 regenerator-runtime 콘솔 오류가 발생한다면, `npm i regenerator-runtime`를 터미널에 입력해서 설치해줘야함

  - 참고 링크 : [npm : regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime)

- 만약 카메라가 없는 pc의 경우 `NotFoundError: Requested device not found` 콘솔 오류가 뜬다... 🥲
