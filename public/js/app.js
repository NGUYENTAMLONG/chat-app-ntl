let username;
let socket = io();
do {
  username = prompt("Enter your name: ");
} while (!username);

const textarea = document.querySelector("#textarea");
const submitBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment__box");

syncGetAllComment();

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let comment = textarea.value;
  if (!comment) {
    return;
  }

  postComment(comment);
});

function postComment(comment) {
  // Append to dom
  let data = {
    commentId: uuid(),
    username: username,
    comment: comment,
  };
  appendToDom(data);
  textarea.value = "";
  // Broadcast
  broadcastComment(data);

  //Sync with mongoDB
  syncWithDb(data);
}

//.format("LT")
function appendToDom(data, likes) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "card", "border-primary", "mb-2");

  let markup = `
            <div class="card-body" id="${data.commentId}">
              <div class="card-header">
                <h6>${data.username}</h6>
              <div class="card-time">
                <img src="/img/clock.png" alt="clock">
                <small>${moment(data.time).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}</small>
              </div>
              </div>
              <p class="content">
                ${data.comment}
              </p>
              <div class="behaviour">
                 <div class="like">
                    <label for="check_like-${data.commentId}">
                       <i class="fas fa-thumbs-up" id="thumb-${
                         data.commentId
                       }" onclick="myFunc('${data.commentId}')"></i>
                    </label>
                    <span class="likes__count">${likes ? data.likes : 0}</span>
                    <input type="checkbox" id="check_like-${
                      data.commentId
                    }" hidden>
              </div>
               
              <div class="response" onclick = "replyFunction('${
                data.commentId
              }','${username}')">
              <i class="fas fa-reply"></i> Reply 
             </div>
             </div>
             
            <div class="reply_zone">
            </div>

              ${
                username === "tamlong"
                  ? `<div class="delete-comment" style="float:right;margin-right:10px">
                       <i class="fas fa-2x fa-trash" onclick="deleteComment('${data._id}')"></i>
                </div>`
                  : ""
              }
            </div>
            `;
  lTag.innerHTML = markup;
  commentBox.prepend(lTag);
}
function appendToDomReply(data, likes) {
  const place = document
    .getElementById(data.commentId.commentId)
    .querySelector(".reply_zone");
  let markup = `
             <div class="card-body m-3 card border-success">
               <div class="card-header">
                <h6>${data.username} <i class="fas fa-arrow-right"></i> ${
    data.commentId.username
  } </h6>
              <div class="card-time">
                <img src="/img/clock.png" alt="clock">
                <small>${moment(data.time).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}</small>
              </div>
              </div>
              <p class="content">
                ${data.reply}
              </p>
               <div class="behaviour">
                 <div class="like">
                    <label for="check_like-${data.replyId}">
                       <i class="fas fa-thumbs-up" id="thumb-${
                         data.replyId
                       }" onclick="myFunc('${data.replyId}')"></i>
                    </label>
                    <span class="likes__count">${likes ? data.likes : 0}</span>
                    <input type="checkbox" id="check_like-${
                      data.replyId
                    }" hidden>
              </div>
              <div class="response" onclick = "replyFunction('${data._id}')">
              <i class="fas fa-reply"></i> Reply 
             </div>
             </div>
             </div>
            `;
  place.innerHTML += markup;
}

function broadcastComment(data) {
  // Socket
  socket.emit("comment", data);
}
socket.on("comment", (data) => {
  appendToDom(data);
});
let typingDiv = document.querySelector(".typing");
socket.on("typing", (data) => {
  typingDiv.innerHTML = `${data.username} is typing <p class="blink-dots">...</p>`;
});

socket.on("focusout", (data) => {
  if (data.flag === false) {
    typingDiv.innerHTML = "";
  }
});

socket.on("deleteComment", (data) => {
  // console.log(data);
  // const comment = document.querySelector("")
});
//Event listener on textarea
textarea.addEventListener("keyup", (e) => {
  socket.emit("typing", { username: username });
});
textarea.addEventListener("focusout", (e) => {
  socket.emit("focusout", { flag: false });
});

function syncWithDb(data) {
  const headers = {
    "content-Type": "application/json",
  };
  fetch("api/comments", {
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

function syncGetAllComment() {
  const headers = {
    "content-Type": "application/json",
  };
  fetch("api/comments", {
    method: "GET",
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      result.commentList.forEach((element) => {
        element.time = element.createdAt;
        // console.log(element);
        appendToDom(element, element.likes);
      });
      result.replyList.forEach((element) => {
        element.time = element.createdAt;
        // console.log(element);
        appendToDomReply(element, element.likes);
      });
    })
    .catch((error) => console.log(error));
}

// Check admin (tamlong)
function deleteComment(commentId) {
  console.log(commentId);
  const headers = {
    "content-Type": "application/json",
  };
  fetch(`api/comments/${commentId}`, {
    method: "DELETE",
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      // console.log(result);
      socket.emit("deleteComment", { commentId: commentId });
    })
    .catch((error) => console.log(error));
}
