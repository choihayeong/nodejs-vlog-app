const videoEl = document.querySelector("video");

const playBtnEl = document.getElementById("play");
const muteBtnEl = document.getElementById("mute");
const volumeRangeEl = document.getElementById("volume");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const timelineEl = document.getElementById("timeline");

let initVolume = 0.5;
videoEl.volume = initVolume;

const clickPlayBtn = (e) => {
  if (videoEl.paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }

  playBtnEl.innerText = videoEl.paused ? "Play" : "Pause";
};
const handleVideoPause = () => (playBtnEl.innerText = "Play");
const handleVideoPlay = () => (playBtnEl.innerText = "Pasue");

const clickMuteBtn = (e) => {
  if (videoEl.muted) {
    videoEl.muted = false;
  } else {
    videoEl.muted = true;
  }

  muteBtnEl.innerText = videoEl.muted ? "Unmute" : "Mute";
  volumeRangeEl.value = videoEl.muted ? 0 : initVolume;
};

const changeVolumeController = (e) => {
  const {
    target: { value },
  } = e;

  if (videoEl.muted) {
    videoEl.muted = false;
    muteBtnEl.innerText = "Mute";
  }

  initVolume = value;
  videoEl.volume = value;
};

const formatTimer = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(11, 19); // 야매 방법임 ㅋ

const loadedMetaDataVideo = () => {
  totalTimeEl.innerText = formatTimer(Math.floor(videoEl.duration));
  timelineEl.max = Math.floor(videoEl.duration);
};

const timeUpdateVideo = () => {
  currentTimeEl.innerText = formatTimer(Math.floor(videoEl.currentTime));
  timelineEl.value = Math.floor(videoEl.currentTime);
};

const changeTimeLineController = (e) => {
  const {
    target: { value },
  } = e;

  videoEl.currentTime = value;
};

playBtnEl.addEventListener("click", clickPlayBtn);
muteBtnEl.addEventListener("click", clickMuteBtn);
videoEl.addEventListener("pause", handleVideoPause);
videoEl.addEventListener("play", handleVideoPlay);
volumeRangeEl.addEventListener("input", changeVolumeController);
videoEl.addEventListener("loadedmetadata", loadedMetaDataVideo);
videoEl.addEventListener("timeupdate", timeUpdateVideo);
timelineEl.addEventListener("input", changeTimeLineController);
