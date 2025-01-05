const inputVideoId = document.getElementById("videoId");
const formEl = document.getElementById("commentForm");

const importNewComment = (text) => {
  const commentsListEl = document.querySelector(".comments__list");
  const newCommentEl = document.createElement("li");
  const iconEl = document.createElement("i");
  const divEl = document.createElement("div");

  iconEl.classList.add("fa-comment", "fas");

  divEl.innerText = `${text}`;

  newCommentEl.appendChild(iconEl);
  newCommentEl.appendChild(divEl);

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

  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  textareaEl.value = "";

  if (status === 201) {
    importNewComment(text);
  }
};

if (formEl) {
  formEl.addEventListener("submit", submitComment);
}
