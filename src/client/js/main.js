import "../scss/style.scss";

const headerMenu = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeBtn");
const gnbEl = document.getElementById("gnb");

const gnbOpen = () => {
  gnbEl.classList.add("active");
};
const gnbClose = () => {
  gnbEl.classList.remove("active");
};

headerMenu.addEventListener("click", gnbOpen);
closeMenu.addEventListener("click", gnbClose);
