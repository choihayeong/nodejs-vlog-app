## Thumbnail

- `/src/models/Video.js` 에서 `thumnail_url` 속성 추가

```javascript
const videoSchema = new mongoose.Schema({
  // ...
  thumbnail_url: { type: String, required: true }, // 추가
  // ...
});
```

- `/src/views/upload.pug` 에서 thumbnail 업로드 하는 부분 추가

```pug
extends base

block content
  form(method="post", enctype="multipart/form-data")
    label(for="vlog_video") Video File
		input(type="file", id="vlog_video", name="vlog_video", accept="video/*", required)
    //- 추가
		label(for="vlog_thumbnail") Thumbnail File
		input(type="file", id="vlog_thumbnail", name="vlog_thumbnail", accept="image/*", required)
```

- `/src/routers/videoRouter.js` 에서 `/upload` 부분을 개선

  - video, thumnbnail 파일 2개를 올려야 하기 때문에 `middleware`에서 불러오는 `videoUpload`를 `single`에서 `fields`로 바꿔 줌

  ```javascript
  videoRouter
    .route("/upload")
    .all(protectorMiddleware)
    .get(getUploadVideo)
    .post(
      videoUpload.fields([
        { name: "vlog_video", maxCount: 1 },
        { name: "vlog_thumbnail", maxCount: 1 },
      ]),
      postUploadVideo,
    );
  ```

- `/src/controller/videoController.js` 에서 `postUploadVideo` 부분 개선

```javascript
export const postUploadVideo = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { vlog_video, vlog_thumbnail } = req.files; // 원래 const { path: file_url } = req.file 을 변경

  try {
    const newVideo = await videoModel.create({
      // ...
      file_url: vlog_video[0].path, // 추가
      thumbnail_url: vlog_thumbnail[0].path, // 추가
      // ...
    });
  } catch (err) {
    //...
  }
};
```

### Refactor

- `/src/client/js/recorder.js` 내 `stopRecord` 함수 삭제

```javascript
/* ❌ 삭제
const stopRecord = () => {
  actionBtnEl.innerText = "Download Recording";
  actionBtnEl.removeEventListener("click", stopRecord);
  actionBtnEl.addEventListener("click", downloadData);

  recorder.stop();
}; */

const startRecord = () => {
  actionBtnEl.innerText = "Recording";
  actionBtnEl.disabled = true;
  actionBtnEl.removeEventListener("click", startRecord);
  // actionBtnEl.addEventListener("click", stopRecord); // 삭제

  recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  recorder.ondataavailable = (event) => {
    audioFile = URL.createObjectURL(event.data);
    previewEl.srcObject = null;
    previewEl.src = audioFile;
    previewEl.loop = true;
    previewEl.play();

    actionBtnEl.innerText = "Donwload";
    actionBtnEl.disabled = false;
    actionBtnEl.addEventListener("click", downloadData);
  };

  recorder.start();

  setTimeOut(() => {
    recorder.stop();
  }, 5000);
};
```
