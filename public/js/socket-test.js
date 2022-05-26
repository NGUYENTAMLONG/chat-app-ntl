// const likeBtn = document.querySelector(".fa-thumbs-up");

// likeBtn.addEventListener("click", () => {
//   // broadcastLike(data);
//   alert("fsa");
// });

function myFunc(commentId) {
  let value = document
    .getElementById(commentId)
    .querySelector(".likes__count").textContent;
  let count = parseInt(value) + 1;
  document.getElementById(commentId).querySelector(".likes__count").innerHTML =
    count;
  //Event listener on textarea
  socket.emit("likeAction", { commentId: commentId, like: count });
  //update like count
  likeUpdate({ commentId: commentId, like: count });
}
socket.on("likeAction", (data) => {
  document
    .getElementById(data.commentId)
    .querySelector(".likes__count").innerHTML = data.like;
});
function likeUpdate(data) {
  // Socket
  const headers = {
    "content-Type": "application/json",
  };
  fetch("api/comments/" + data.commentId, {
    method: "PUT",
    body: JSON.stringify(data),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => console.log(error));
}
