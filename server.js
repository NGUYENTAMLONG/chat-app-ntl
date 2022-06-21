const express = require("express");
const app = express();
const { startSession } = require("mongoose");

const port = process.env.PORT || 4444;

app.use(express.static("public"));

app.use(express.json());

//DB connect
const dbConnect = require("./db");
dbConnect();
//Routes
const Comment = require("./model/comment");
const Reply = require("./model/replycomment");
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
app.put("/api/comments/", async (req, res) => {
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
app.delete("/api/comments/:id", async (req, res) => {
  const commentId = req.params.id;
  const session = await startSession();
  console.log(commentId);
  try {
    session.startTransaction();
    const dataTransaction = {
      session: session,
    };
    await Comment.findOneAndDelete(
      {
        id: commentId,
      },
      dataTransaction
    );
    await Reply.deleteMany(
      {
        commentId: commentId,
      },
      dataTransaction
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "DELETED SUCCESSFUL !!!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json(error);
  }
});
app.get("/api/comments", async (req, res) => {
  try {
    const commentList = await Comment.find();
    const replyList = await Reply.find().populate("commentId", [
      "username",
      "commentId",
    ]);

    res.status(200).json({ commentList, replyList });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.post("/api/replies", async (req, res) => {
  const { commentId, replyId, username, reply } = req.body;
  try {
    const foundComment = await Comment.findOne({ commentId: commentId });
    const createdReply = await Reply.create({
      replyId,
      username,
      commentId: foundComment.id,
      reply,
    });
    res.status(200).json(createdReply);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/replies", async (req, res) => {
  try {
    const replies = await Reply.find();
    res.status(200).json(replies);
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
    // console.log(data);
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

  socket.on("deleteComment", async (data) => {
    try {
      console.log(data);
      // const foundComment = await Comment.findById(data.commentId);
      // socket.broadcast.emit("deleteComment", foundComment);
    } catch (error) {
      console.log(error);
    }
  });
});
