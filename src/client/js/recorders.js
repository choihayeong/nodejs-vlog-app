const recordBtnEl = document.getElementById("recordBtn");
const previewEl = document.getElementById("preview");

let stream;
let recorder;
let audioFile;

const downloadData = () => {
  const anchor = document.createElement("a");
  anchor.href = audioFile;
  anchor.download = "MyRecording.webm";
  document.body.appendChild(anchor);
  anchor.click();
};

const stopRecord = () => {
  recordBtnEl.innerText = "Download Recording";
  recordBtnEl.removeEventListener("click", stopRecord);
  recordBtnEl.addEventListener("click", downloadData);

  recorder.stop();
};

const startRecord = () => {
  recordBtnEl.innerText = "Stop Recording";
  recordBtnEl.removeEventListener("click", startRecord);
  recordBtnEl.addEventListener("click", stopRecord);

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

recordBtnEl.addEventListener("click", startRecord);
