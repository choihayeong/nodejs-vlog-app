const inputVideoId = document.getElementById("videoId");
const formEl = document.getElementById("commentForm");

const importNewComment = (text, idx) => {
  const commentsListEl = document.querySelector(".comments__list");
  const newCommentEl = document.createElement("li");
  const iconEl = document.createElement("i");
  const divEl = document.createElement("div");
  const buttonEl = document.createElement("button");

  iconEl.classList.add("fa-comment", "fas");

  divEl.innerText = `${text}`;

  buttonEl.innerText = `❌`;

  newCommentEl.dataset.id = idx;
  newCommentEl.appendChild(iconEl);
  newCommentEl.appendChild(divEl);
  newCommentEl.appendChild(buttonEl);

  commentsListEl.prepend(newCommentEl);
};

const submitComment = async (event) => {
  event.preventDefault();
  const textareaEl = formEl.querySelector("textarea");
  const text = textareaEl.value;
  const videoId = inputVideoId.value;

  if (text === "") {
    return alert("공백은 댓글로 입력할 수 없습니당");
  }

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  textareaEl.value = "";

  if (response.status === 201) {
    const { newCommentId } = await response.json();
    importNewComment(text, newCommentId);
  }
};

if (formEl) {
  formEl.addEventListener("submit", submitComment);
}
