const recordBtnEl = document.getElementById("recordBtn");

const startRecord = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  console.log(stream);
};

recordBtnEl.addEventListener("click", startRecord);
