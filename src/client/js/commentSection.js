const inputVideoId = document.getElementById("videoId");
const formEl = document.getElementById("commentForm");

const submitComment = async (event) => {
  event.preventDefault();
  const textareaEl = formEl.querySelector("textarea");
  const text = textareaEl.value;
  const videoId = inputVideoId.value;

  if (text === "") {
    return alert("공백은 댓글로 입력할 수 없습니당");
  }

  await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  textareaEl.value = "";

  window.location.reload();
};

if (formEl) {
  formEl.addEventListener("submit", submitComment);
}
