const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", socket => {
  socket.on("message", message => {
    socket.broadcast.emit("message", message);
  });
});

http.listen(8080, () => {
  console.log("listening on *:8080");
});
