// const likeBtn = document.querySelector(".fa-thumbs-up");

// likeBtn.addEventListener("click", () => {
//   // broadcastLike(data);
//   alert("fsa");
// });

function myFunc(commentId) {
  let value = document
    .getElementById(commentId)
    .querySelector(".likes__count").textContent;

  const inputCheck = document.querySelector(`#check_like-${commentId}`);
  let count = parseInt(value);

  if (inputCheck.checked !== true) {
    document
      .querySelector(`#thumb-${commentId}`)
      .classList.toggle("text-primary");
    document
      .getElementById(commentId)
      .querySelector(".likes__count").innerHTML = count + 1;
    count++;
  } else {
    document
      .querySelector(`#thumb-${commentId}`)
      .classList.toggle("text-primary");
    document
      .getElementById(commentId)
      .querySelector(".likes__count").innerHTML = count - 1;
    count--;
  }
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
  fetch("api/comments/", {
    method: "PUT",
    body: JSON.stringify(data),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      //   console.log(result);
    })
    .catch((error) => console.log(error));
}

function replyFunction(commentId, username) {
  const replyZone = document
    .getElementById(`${commentId}`)
    .querySelector(".reply_zone");
  let html = `
    <div class="row mb-4 d-flex justify-content-center">
      <div class="col-md-10">
        <b class="border-bottom pb-2">Reply to ${username}</b>
      </div>
      <div class="col-md-10">
        <div class="form-group">
          <textarea id="textarea-reply" rows="10"  class="form-control"></textarea>
        </div>
      </div>
      <div class="col-md-10 mb-3">
        <button onclick="submitReply({username:'${username}',commentId:'${commentId}'})" class="btn btn-primary mt-2" style="float: right;">Post comment</button>
      </div>
    </div>`;
  replyZone.innerHTML = html;
}
