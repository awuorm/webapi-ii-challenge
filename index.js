const server = require("./server");

server.listen(process.env.PORT || 3000, () => {
    console.log("server is  listening on port " + (process.env.PORT || 3000))
})