const recordBtnEl = document.getElementById("recordBtn");
const previewEl = document.getElementById("preview");

let stream;
let recorder;

const downloadData = () => {};

const stopRecord = () => {
  recordBtnEl.innerText = "Download Recording";
  recordBtnEl.removeEventListener("click", stopRecord);
  recordBtnEl.addEventListener("click", startRecord);

  recorder.stop();
};

const startRecord = () => {
  recordBtnEl.innerText = "Stop Recording";
  recordBtnEl.removeEventListener("click", startRecord);
  recordBtnEl.addEventListener("click", stopRecord);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    const audioFile = URL.createObjectURL(event.data);
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
    // video: { width: 200, height: 100 },
  });

  previewEl.srcObject = stream;
  previewEl.play();
};

init();

recordBtnEl.addEventListener("click", startRecord);
