const updateBtnEl = document.getElementById("btnRefresh");
const inputUserId = document.getElementById("userId");

const refreshDatabase = async () => {
  const userId = inputUserId.value;

  const response = await fetch(`/api/user/${userId}/videos`, {
    method: "PUT",
  });

  if (response.status === 202) {
    alert("DB에 업데이트 되었습니다!");
  }
};

updateBtnEl.addEventListener("click", refreshDatabase);
