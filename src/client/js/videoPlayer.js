const videoEl = document.querySelector("video");

const playBtnEl = document.getElementById("play");
const muteEl = document.getElementById("mute");
const timeEl = document.getElementById("time");
const volumeEl = document.getElementById("volume");

const clickPlayBtn = (e) => {
  if (videoEl.paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }
};
const handleVideoPause = () => (playBtnEl.innerText = "Play");
const handleVideoPlay = () => (playBtnEl.innerText = "Pasue");

const handleMute = (e) => {};

playBtnEl.addEventListener("click", clickPlayBtn);
muteEl.addEventListener("click", handleMute);
videoEl.addEventListener("pause", handleVideoPause);
videoEl.addEventListener("play", handleVideoPlay);
