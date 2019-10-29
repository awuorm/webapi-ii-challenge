const express = require("express");
// const cors = require("cors");
const db = require("../db");

const router = express.Router();

// router.use(cors());
// router.use(express.json());

router.post("/:id/comments", handlePostComments);
router.get("/:id/comments", handleGetComments);
router.get("/:id", handleGetPostByID);
router.put("/:id", handlePostEdit);
router.delete("/:id", handlePostDelete);
router.post("/", handlePosts);
router.get("/", handleAllGetPosts);

function handlePostEdit(req, res) {
  const { id } = req.params;
  const post = {
    title: req.body.title,
    contents: req.body.contents
  };
  db.update(id, post)
    .then(data => {
      res.json(data);
      console.log("response from router", data);
    })
    .catch(error => {
      res.json({ errorMessaga: error });
      console.log("error from edit endpoint", error);
    });
}

function handlePostDelete(req, res) {
  const { id } = req.params;
  db.remove(id)
    .then(data => {
      res.json(data);
      console.log("removed", data);
    })
    .catch(error => {
      res.json(error);
      console.log("error from delete endpoint", error);
    });
}

function handleGetPostByID(req, res) {
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      res.json(data);
      console.log("response from get post by id", data);
    })
    .catch(error => {
      res.json({ errorMessaga: error });
      console.log("error from get post by id", error);
    });
}

function handleGetComments(req, res) {
  const { id } = req.params;
  db.findCommentById(id)
    .then(data => {
      res.json(data);
      console.log("response from get comment by id", data);
    })
    .catch(error => {
      res.json({ errorMessaga: error });
      console.log("error from get comment by ID", error);
    });
}

function handlePostComments(req, res) {
  const comment = {
    text: req.body.text,
    post_id: req.params.id
  };
  db.insertComment(comment)
    .then(data => {
      res.json(data);
      console.log("response from  post comments endpoint", data);
    })
    .catch(error => {
      res.json({ errorMessage: error });
      console.log("error from post comments endpoint", error);
    });
}

function handleAllGetPosts(req, res) {
  db.find()
    .then(data => {
      res.json(data);
      console.log("response from  getposts endpoint", data);
    })
    .catch(error => {
      res.json({ errorMessage: error });
      console.log("error from posts endpoint", error);
    });
}

function handlePosts(req, res) {
  const post = {
    title: req.body.title,
    contents: req.body.contents
  };
  db.insert(post)
    .then(data => {
      res.json(data);
      console.log("response from posts endpoint", data);
    })
    .catch(error => {
      if (post.title || post.contents === undefined) {
        res.json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else if (post.title || post.contents !== undefined) {
        res.json({ errorMessage: error });
        console.log("error from posts endpoint", error);
      }
    });
}

module.exports = router;
