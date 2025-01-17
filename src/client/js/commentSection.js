const inputVideoId = document.getElementById("videoId"); // watch.pug에만 적용할 것
const formEl = document.getElementById("commentForm");
const deleteBtnEls = document.querySelectorAll(".btn-delete--comment");
const deleteAllBtnEl = document.getElementById("deleteAllComments");

// MARK: [wip] 실시간 댓글 (개선 필요)
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

// MARK: 댓글 생성 (watch.pug)
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

// MARK: 댓글 삭제버튼 (watch.pug, users/comments.pug)
const deleteComment = async (id, video) => {
  const commentId = id;
  const videoId = video;

  const response = await fetch(`/api/comment/${commentId}/video/${videoId}`, {
    method: "DELETE",
  });

  if (response.status === 202) {
    window.location.reload();
  }
};

if (deleteBtnEls) {
  deleteBtnEls.forEach((item, index) => {
    const { id, video } = item.dataset;

    item.addEventListener("click", function () {
      const confirmStatus = confirm("댓글을 삭제하시겠습니까?");
      if (confirmStatus) {
        deleteComment(id, video);
      }
    });
  });
}

const deleteAllComments = async () => {
  const userId = document.getElementById("userId").value;

  console.log(userId);

  const response = await fetch(`/api/user/${userId}/comments-all`, {
    method: "DELETE",
  });

  if (response.status === 202) {
    window.location.reload();
  }
};

// MARK: 모든 댓글 삭제 버튼 (users/comments.pug)
if (deleteAllBtnEl) {
  deleteAllBtnEl.addEventListener("click", deleteAllComments);
}
