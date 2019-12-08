const express = require("express");
const router = express.Router();

const Stream = require("../models/Stream");

router.post("/add", async (req, res, next) => {
  const stream = await Stream.create(req.body);

  res.status(200).json(stream);

  return sendToAll(stream);

});

let clients = [];

router.get("/", async (req, res, next) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache"
  };
  res.writeHead(200, headers);

  // Send data
  const streams = await Stream.find();
  let json = streams.map((p) => p.toJSON());
  const data = `data: ${JSON.stringify(json)}\n\n`;
  res.write(data);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(c => c.id !== clientId);
  });
});

function sendToAll(stream) {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(stream)}\n\n`))
}

module.exports = router;
