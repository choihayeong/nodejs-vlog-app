const updateBtnEl = document.getElementById("refreshVideos");
const deleteAllBtnEl = document.getElementById("deleteAllVideos");
const inputUserId = document.getElementById("userId");

const refreshUserDB = async () => {
  const userId = inputUserId.value;

  const response = await fetch(`/api/user/${userId}/videos`, {
    method: "PUT",
  });

  if (response.status === 202) {
    alert("DB(users/videos)에 업데이트 되었습니다!");
  }
};

const deleteAllVideos = async () => {
  const userId = inputUserId.value;

  const response = await fetch(`/api/user/${userId}/videos-all`, {
    method: "DELETE",
  });
};

updateBtnEl.addEventListener("click", refreshUserDB);
deleteAllBtnEl.addEventListener("click", deleteAllVideos);
