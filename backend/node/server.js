const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
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
