const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => console.log("DB connection successful!"));

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const stream = require("./routes/stream");
const getData = require("./services/datasource");

const app = express();

app.use(express.json());

// app.use("/stream", stream);
app.get("/stream", (req, res) => {

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",

    // enabling CORS
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  });

  setInterval(() => {
    res.write(`event: message\n`);
    res.write(`data: ${JSON.stringify(getData())}\n\n`);
  }, 2000)

});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));