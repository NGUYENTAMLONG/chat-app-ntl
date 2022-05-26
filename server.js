const express = require("express");
const app = express();

const port = process.env.PORT || 4444;

app.use(express.static("public"));

app.use(express.json());

//DB connect
const dbConnect = require("./db");
dbConnect();
//Routes
const Comment = require("./model/comment");
app.post("/api/comments", (req, res) => {
  const comment = new Comment({
    commentId: req.body.commentId,
    username: req.body.username,
    comment: req.body.comment,
  });
  comment
    .save(comment)
    .then((response) => res.send(response))
    .catch((error) => console.log(error));
});
app.put("/api/comments/:id", async (req, res) => {
  const { commentId, like } = req.body;
  try {
    await Comment.findOneAndUpdate(
      {
        commentId: commentId,
      },
      { likes: like }
    );
    res.status(200).json("update success");
  } catch (error) {
    res.status(500).json(error);
  }
});
app.get("/api/comments", async (req, res) => {
  try {
    const commentList = await Comment.find();
    res.status(200).json(commentList);
  } catch (error) {
    res.status(500).json(error);
  }
});
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  // console.log(`New connection ${socket.id}`);
  socket.on("comment", (data) => {
    data.time = Date();
    console.log(data);
    // {username:"dsd",comment:"this is comment", time:Date()}
    socket.broadcast.emit("comment", data);
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("focusout", (data) => {
    socket.broadcast.emit("focusout", data);
  });

  socket.on("likeAction", (data) => {
    socket.broadcast.emit("likeAction", data);
  });
});
