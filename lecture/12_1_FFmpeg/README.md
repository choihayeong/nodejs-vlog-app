# WebAssembly Video Transcode

## Introduction

- FFmpeg 설치

### WebAssembly

- ffmpeg.wasm 이용

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/core
```

- `/src/client/js/recorder.js` 에 임포트 후 `downloadData` 함수에 다음과 같이 작성

  - [FFmpeg Usage](https://ffmpegwasm.netlify.app/docs/getting-started/usage)

```javascript
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let videoFile;

const downloadData = async () => {
  // MARK: FFmpeg
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const mp4File = ffmpeg.FS("readFile", "output.mp4");

  console.log(mp4File);
  console.log(mp4File.buffer);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);

  const anchor = document.createElement("a");
  anchor.href = mp4Url; // mp4Url로 변경
  anchor.download = "MyRecording.mp4"; // MyRecording.webm 의 확장자를 mp4로 변경
  document.body.appendChild(anchor);
  anchor.click();
};
```

### Thumbnail

- `/src/client/js/recorder.js` 내 `downloadData` 함수에 다음과 같이 작성

```javascript
const downloadData = async () => {
  //...
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg",
  );

  const thumnailFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const thumnailBlob = new Blob([thumnailFile.buffer], { type: "image/jpg" });
  const thumnailUrl = URL.createObjectURL(thumnailBlob);

  const thumbnailAnchor = document.createElement("a");
  thumbnailAnchor.href = thumnailUrl;
  thumbnailAnchor.download = "VideoThumbnail.jpg";
  document.body.appendChild(thumbnailAnchor);
  thumbnailAnchor.click();
};
```

## Summary

- FFmpeg 프로그램을 사용하기 때문에 FS(파일 시스템)을 사용할 수 있음

- 녹화한 비디오 파일의 정보(`videoFile`)를 FFmpeg에 저장 후 명령어 실행

```javascript
let videoFile; // 녹화한 비디오 파일의 정보 (type: ObjectURL)

await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4"); // 초당 60프레임으로 저장
```

- `ffmpeg.run("readFile")` 의 `readFile` 리턴값은 Unit8Array(unsigned integer = positive integer, 양의 정수)

  - `readFile`의 0, 1로 이루어진 실제 파일들은 `buffer` 속성을 이용해서 얻을 수 있음 (Unit8Array.buffer)

- new Blob Constructor : file-like 객체를 만듬

- 용량이 커지므로 마지막에 unlink를 사용함. (`ffmpeg.FS("unlink")`)

- `downloadData` 함수 최종 코드

```javascript
const downloadData = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg",
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumnailFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumnailBlob = new Blob([thumnailFile.buffer], { type: "image/jpg" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumnailUrl = URL.createObjectURL(thumnailBlob);

  const anchor = document.createElement("a");
  anchor.href = mp4Url;
  anchor.download = "MyRecording.mp4"; // MyRecording.webm 의 확장자를 mp4로 변경
  document.body.appendChild(anchor);
  anchor.click();

  const thumbnailAnchor = document.createElement("a");
  thumbnailAnchor.href = thumnailUrl;
  thumbnailAnchor.download = "VideoThumbnail.jpg";
  document.body.appendChild(thumbnailAnchor);
  thumbnailAnchor.click();

  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumnailUrl);
  URL.revokeObjectURL(videoFile);
};
```

## Refactor

- `/src/client/js/recorders.js`에서 `const files: {}` 로 정리

```javascript
const files = {
  input: "recording.webm",
  output: "ouput.mp4",
  thumbnail: "thumbnail.jpg",
};

const downloadData = async () => {
  //...

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumbnail,
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumnailFile = ffmpeg.FS("readFile", files.thumbnail);

  //...

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumbnail);

  //...
};
```

- `<a>` 태그 다운로드 부분 정리 (주석 부분 삭제 후 `downloadfile` 함수로 정리)

```javascript
/**
 * @param {String} fileUrl
 * @param {String} fileName
 */
const downloadfile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.append(a);
  a.click();
};

const downloadData = async () => {
  /*const anchor = document.createElement("a");
  anchor.href = mp4Url;
  anchor.download = "MyRecording.mp4"; // MyRecording.webm 의 확장자를 mp4로 변경
  document.body.appendChild(anchor);
  anchor.click();

  const thumbnailAnchor = document.createElement("a");
  thumbnailAnchor.href = thumnailUrl;
  thumbnailAnchor.download = "VideoThumbnail.jpg";
  document.body.appendChild(thumbnailAnchor);
  thumbnailAnchor.click(); */

  downloadfile(mp4Url, "MyRecording.mp4");
  downloadfile(thumnailUrl, "VideoThumbnail.jpg");
};
```

- `recordBtn` 을 `actionBtn` 으로 변경

```pug
//- /src/views/upload.pug
extends base

block content
	div
		//- video#preview
		audio(controls)#preview
		button#actionBtn Start Record

```

```javascript
const actionBtnEl = document.getElementById("actionBtn");

const downloadData = async () => {
  actionBtnEl.removeEventListener("click", downloadData);

  actionBtnEl.innerText = "Transcoding....";
  actionBtnEl.disabled = true;

  //...

  actionBtnEl.disabled = false;
  actionBtnEl.innerText = "Record Again";
  actionBtnEl.addEventListener("click", downloadData);
};

const stopRecord = () => {
  actionBtnEl.innerText = "Download Recording";
  actionBtnEl.removeEventListener("click", stopRecord);
  actionBtnEl.addEventListener("click", downloadData);

  recorder.stop();
};

const startRecord = () => {
  actionBtnEl.innerText = "Stop Recording";
  actionBtnEl.removeEventListener("click", startRecord);
  actionBtnEl.addEventListener("click", stopRecord);
};

actionBtnEl.addEventListener("click", startRecord);
```
