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

const inputVideoId = document.getElementById("videoId");

let controllerTimeout = null;
let controllerMovementTiemout = null;
let initVolume = 0.5;
videoEl.volume = initVolume;

// MARK: 플레이 버튼
const clickPlayBtn = (e) => {
  if (videoEl.paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }

  playBtnIcon.classList = videoEl.paused ? "fas fa-play" : "fas fa-pause";
};
const handleVideoPause = () => (playBtnIcon.classList = "fas fa-play");
const handleVideoPlay = () => (playBtnIcon.classList = "fas fa-pause");

// MARK: 뮤트 버튼
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

// MARK: 볼륨조절 버튼
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

// MARK: 타이머 포맷
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

// MARK: 비디오 타임라인
const changeTimeLineController = (e) => {
  const {
    target: { value },
  } = e;

  videoEl.currentTime = value;
};

// MARK: 전체화면
const changeScreenStatus = () => {
  const isFullScreen = document.fullscreenElement;

  if (isFullScreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainerEl.requestFullscreen();
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

// MARK: 조회수 체크
const endedVideo = () => {
  const api_id = inputVideoId.value;

  fetch(`/api/videos/${api_id}/view`, {
    method: "POST",
  });
};

playBtnEl.addEventListener("click", clickPlayBtn);
muteBtnEl.addEventListener("click", clickMuteBtn);
videoEl.addEventListener("pause", handleVideoPause);
videoEl.addEventListener("play", handleVideoPlay);
volumeRangeEl.addEventListener("input", changeVolumeController);
videoEl.addEventListener("loadeddata", loadedMetaDataVideo);
videoEl.addEventListener("timeupdate", timeUpdateVideo);
videoEl.addEventListener("ended", endedVideo);
timelineEl.addEventListener("input", changeTimeLineController);
fullScreenBtnEl.addEventListener("click", changeScreenStatus);
videoContainerEl.addEventListener("mousemove", moveOnMouseVideo);
videoContainerEl.addEventListener("mouseleave", moveOutMouseVideo);
