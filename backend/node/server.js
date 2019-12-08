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

const app = express();

app.use("/stream", stream);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`The server is listening on port ${PORT}`));
