const express = require("express");
const db = require("../db");

const router = express.Router();

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
      if (data === Number(0)) {
        console.log("response from get post by id", data);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (data !== Number(0)) {
        if (post.title || post.contents === undefined) {
          console.log("response from get post by id", data);
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
          });
        } else if (post.title && post.contents !== undefined) {
          res.status(200).json({ sucess: " post edited", edited: post });
          console.log("response from router", data);
        }
      }
    })
    .catch(error => {
      if (
        error.message ===
        "Empty .update() call detected! Update data does not contain any values to update. This will result in a faulty query."
      ) {
        console.log("response from get post by id", error);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (
        error.message !==
        "Empty .update() call detected! Update data does not contain any values to update. This will result in a faulty query."
      ) {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
        console.log("response from get post by id", error.message);
      }
    });
}

function handlePostDelete(req, res) {
  const { id } = req.params;
  db.remove(id)
    .then(data => {
      if (data === Number(0)) {
        console.log("response from get post by id", data);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (data !== Number(0)) {
        res.status(200).json({ success: "post removed successfully" });
        console.log("response from get post by id", data);
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The post could not be removed" });
      console.log("error from delete endpoint", error);
    });
}

function handleGetPostByID(req, res) {
  const { id } = req.params;
  db.findById(id)
    .then(data => {
      if (data.length === Number(0)) {
        console.log("response from get post by id", data);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (data.length !== Number(0)) {
        res.status(200).json(data);
        console.log("response from get post by id", data);
      }
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
      if (data.length === Number(0)) {
        console.log("response from get post by id", data);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (data.length !== Number(0)) {
        res.status(200).json(data);
        console.log("response from get post by id", data);
      }
    })
    .catch(error => {
      res.json({ error: "The comments information could not be retrieved." });
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
      res.status(201).json({ success: comment });
      console.log("response from  post comments endpoint", data);
    })
    .catch(error => {
      if (comment.text === undefined) {
        console.log("error from posts endpoint", error);
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else if (error.code === "SQLITE_CONSTRAINT") {
        console.log("error from posts endpoint", error);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (error.code !== "SQLITE_CONSTRAINT") {
        res.status(500).json({
          error: "There was an error while saving the comment to the database"
        });
        console.log("error from posts endpoint", error);
      }
    });
}

function handleAllGetPosts(req, res) {
  db.find()
    .then(data => {
      res.json(data);
      console.log("response from  getposts endpoint", data);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
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
      res.status(201).json({ success: post });
      console.log("response from posts endpoint", data);
    })
    .catch(error => {
      if (post.title || post.contents === undefined) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else if (post.title || post.contents !== undefined) {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
        console.log("error from posts endpoint", error);
      }
    });
}

module.exports = router;
