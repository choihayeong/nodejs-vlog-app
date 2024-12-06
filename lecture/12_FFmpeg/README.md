# WebAssembly Video Transcode

## Introduction

- FFmpeg 설치

### WebAssembly

- ffmpeg.wasm 이용

    * `npm install @ffmpeg/ffmpeg @ffmpeg/core`을 실행

- `/src/client/js/recorder.js` 에 임포트

    * [FFmpeg Usage](https://ffmpegwasm.netlify.app/docs/getting-started/usage)

```javascript
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const downloadData = async() => {
  // MARK: FFmpeg
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(audioFile));
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  // ...
};
```


