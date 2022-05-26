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

function appendToDom(data, likes) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "card", "border-primary", "mb-2");

  let markup = `
            <div class="card-body" id="${data.commentId}">
              <h6>${data.username}</h6>
              <p>
                ${data.comment}
              </p>
              <div class="likes">
               <i class="fas fa-thumbs-up" onclick="myFunc('${
                 data.commentId
               }')"></i>
               <span class="likes__count">${likes ? data.likes : 0}</span>
             </div>
            </div>
            <div class="card-time">
              <img src="/img/clock.png" alt="clock">
              <small>${moment(data.time).format("LT")}</small>
            </div>
    `;
  lTag.innerHTML = markup;
  commentBox.prepend(lTag);
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
//Event listener on textarea
textarea.addEventListener("keyup", (e) => {
  socket.emit("typing", { username: username });
});
textarea.addEventListener("focusout", (e) => {
  socket.emit("focusout", { flag: false });
});

// .locale("vi")
// .fromNow()

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
      result.forEach((element) => {
        element.time = element.createdAt;
        console.log(element);
        appendToDom(element, element.likes);
      });
    })
    .catch((error) => console.log(error));
}
