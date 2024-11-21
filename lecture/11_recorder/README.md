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

## Preview

- `/src/views/upload.pug`에 `video#preview`를 다음과 같이 추가

```pug
extends base

block content
	div
		video#preview
		button#recordBtn Start Record
```

- `/src/client/js/recorder.js` 의 `startRecord` 함수를 다음과 같이 추가 작성

```javascript
const recordBtnEl = document.getElementById("recordBtn");
const previewEl = document.getElementById("preview"); // 추가

const startRecord = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 200, height: 100 },
  });

  // console.log(stream);

  previewEl.srcObject = stream;
  previewEl.play();
};

recordBtnEl.addEventListener("click", startRecord);
```

- 참고 링크 : [HTMLMediaElement.srcObject](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject)

## Recording Video/Audio

- 위의 `startRecord()`를 `init()`으로 바꾸고 recordBtn을 눌렀을 때 다음과 같이 작성

```javascript
const recordBtnEl = document.getElementById("recordBtn");
const previewEl = document.getElementById("preview");

const stopRecord = () => {
  recordBtnEl.innerText = "Start Recording";
  recordBtnEl.removeEventListener("click", stopRecord);
  recordBtnEl.addEventListener("click", startRecord);
};

const startRecord = () => {
  recordBtnEl.innerText = "Stop Recording";
  recordBtnEl.removeEventListener("click", startRecord);
  recordBtnEl.addEventListener("click", stopRecord);
};

const init = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 200, height: 100 },
  });

  previewEl.srcObject = stream;
  previewEl.play();
};

init();

recordBtnEl.addEventListener("click", startRecord);
```

- `MediaRecorder` 를 이용할 것임

  - 참고 링크 : [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

```javascript
let stream;

const startRecord = () => {
  recordBtnEl.innerText = "Stop Recording";
  recordBtnEl.removeEventListener("click", startRecord);
  recordBtnEl.addEventListener("click", stopRecord);

  const recorder = new MediaRecorder(stream);
};
```

- `init()` 메서드 안에 있는 `stream` 변수를 `const`을 제외하고 다음과 같이 수정

```javascript
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 200, height: 100 },
  });

  previewEl.srcObject = stream;
  previewEl.play();
};
```

- `startRecord()` 함수

```javascript
const startRecord = () => {
  recordBtnEl.innerText = "Stop Recording";
  recordBtnEl.removeEventListener("click", startRecord);
  recordBtnEl.addEventListener("click", stopRecord);

  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    console.log("recording done");
    console.log(e);
    console.log(e.data);
  };

  console.log(recorder);

  recorder.start();

  console.log(recorder);

  setTimeout(() => {
    recorder.stop();
  }, 10000);
};
```
