const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache"
  };

  // Send data
  res
    .status(200)
    .set(headers)
    .json({ name: "Sirwan Afifi" });
});

module.exports = router;
