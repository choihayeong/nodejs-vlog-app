const inputVideoId = document.getElementById("videoId");
const formEl = document.getElementById("commentForm");

const submitComment = (event) => {
  event.preventDefault();
  const textareaEl = formEl.querySelector("textarea");
  const text = textareaEl.value;
  const videoId = inputVideoId.value;
};

if (formEl) {
  formEl.addEventListener("submit", submitComment);
}
