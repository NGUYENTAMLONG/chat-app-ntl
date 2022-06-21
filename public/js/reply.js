function submitReply(data) {
  const replyZone = document.querySelector(".reply_zone");
  let reply = document.querySelector("#textarea-reply").value;
  if (!reply) {
    return;
  }
  console.log(data);
  postReply(data.username, data.commentId, reply);

  replyZone.innerHTML = "";
}

function postReply(username, commentId, reply) {
  const headers = {
    "content-Type": "application/json",
  };
  const data = {
    replyId: uuid(),
    username,
    commentId,
    reply,
  };
  fetch("api/replies", {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => console.log(error));
}
