const recordBtnEl = document.getElementById("recordBtn");
const previewEl = document.getElementById("preview");

let stream;

const stopRecord = () => {
  recordBtnEl.innerText = "Start Recording";
  recordBtnEl.removeEventListener("click", stopRecord);
  recordBtnEl.addEventListener("click", startRecord);
};

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
