const videoContainerEl = document.getElementById("videoContainer");
const videoControllerEl = document.getElementById("videoController");
const videoEl = document.querySelector("video");

const playBtnEl = document.getElementById("play");
const playBtnIcon = playBtnEl.querySelector("i");
const muteBtnEl = document.getElementById("mute");
const muteBtnIcon = muteBtnEl.querySelector("i");
const volumeRangeEl = document.getElementById("volume");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const timelineEl = document.getElementById("timeline");
const fullScreenBtnEl = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtnEl.querySelector("i");

let controllerTimeout = null;
let controllerMovementTiemout = null;
let initVolume = 0.5;
videoEl.volume = initVolume;

const clickPlayBtn = (e) => {
  if (videoEl.paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }

  playBtnIcon.classList = videoEl.paused ? "fas fa-play" : "fas fa-pause";
};
const handleVideoPause = () => (playBtnEl.innerText = "Play");
const handleVideoPlay = () => (playBtnEl.innerText = "Pasue");

const clickMuteBtn = (e) => {
  if (videoEl.muted) {
    videoEl.muted = false;
  } else {
    videoEl.muted = true;
  }

  muteBtnIcon.classList = videoEl.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
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

const changeScreenStatus = () => {
  const isFullScreen = document.fullscreenElement;

  if (isFullScreen) {
    document.exitFullscreen();
    // fullScreenBtnEl.innerText = "Enter Full Screen";
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainerEl.requestFullscreen();
    // fullScreenBtnEl.innerText = "Exit Full Screen";
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControllers = () => videoControllerEl.classList.remove("showing");

const moveOnMouseVideo = () => {
  if (controllerTimeout) {
    clearTimeout(controllerTimeout);
    controllerTimeout = null;
  }
  if (controllerMovementTiemout) {
    clearTimeout(controllerMovementTiemout);
    controllerMovementTiemout = null;
  }

  videoControllerEl.classList.add("showing");

  controllerMovementTiemout = setTimeout(hideControllers, 3000);
};

const moveOutMouseVideo = () => {
  setTimeout(hideControllers, 3000);
};

playBtnEl.addEventListener("click", clickPlayBtn);
muteBtnEl.addEventListener("click", clickMuteBtn);
videoEl.addEventListener("pause", handleVideoPause);
videoEl.addEventListener("play", handleVideoPlay);
volumeRangeEl.addEventListener("input", changeVolumeController);
videoEl.addEventListener("loadeddata", loadedMetaDataVideo);
videoEl.addEventListener("timeupdate", timeUpdateVideo);
timelineEl.addEventListener("input", changeTimeLineController);
fullScreenBtnEl.addEventListener("click", changeScreenStatus);
videoContainerEl.addEventListener("mousemove", moveOnMouseVideo);
videoContainerEl.addEventListener("mouseleave", moveOutMouseVideo);
