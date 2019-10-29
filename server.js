const express = require("express");
const cors = require("cors");
const router = require("./data/seeds/post-router");

const server = express();

server.use(cors());
server.use(express.json());
server.use("/api/posts",router);

server.get("*", handleDefaultRequest);


function handleDefaultRequest(req, res) {
  res.json({ success: "Hello from server!" });
}

module.exports = server;
