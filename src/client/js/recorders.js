// const recordBtnEl = document.getElementById("recordBtn");
const actionBtnEl = document.getElementById("actionBtn");
const previewEl = document.getElementById("preview");

let stream;
let recorder;
let audioFile;

/* const downloadData = () => {
  const anchor = document.createElement("a");
  anchor.href = audioFile;
  anchor.download = "MyRecording.webm";
  document.body.appendChild(anchor);
  anchor.click();
}; */

const files = {
  input: "recording.webm",
  output: "ouput.mp4",
  thumbnail: "thumbnail.jpg"
};

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

const downloadData = async() => {

  actionBtnEl.removeEventListener("click", downloadData);

  actionBtnEl.innerText = "Transcoding....";
  actionBtnEl.disabled = true;

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumbnail);

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumnailFile = ffmpeg.FS("readFile", files.thumbnail);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumnailBlob = new Blob([thumnailFile.buffer], { type: "image/jpg" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumnailUrl = URL.createObjectURL(thumnailBlob);

  downloadfile(mp4Url, "MyRecording.mp4");
  downloadfile(thumnailUrl, "VideoThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumbnail);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumnailUrl);
  URL.revokeObjectURL(videoFile);

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

  recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
  recorder.ondataavailable = (event) => {
    audioFile = URL.createObjectURL(event.data);
    previewEl.srcObject = null;
    previewEl.src = audioFile;
    previewEl.loop = true;
    previewEl.play();
  };

  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
    /**
     * 비디오 사용시 주석 해제
     */
    // video: { width: 200, height: 100 },
  });

  previewEl.srcObject = stream;
  /**
   * 비디오 사용시 주석 해제
   */
  // previewEl.play();
};

init();

actionBtnEl.addEventListener("click", startRecord);
