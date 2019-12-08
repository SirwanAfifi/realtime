const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trime: true,
    maxLength: [50, "Name can not be more than 50 character"]
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxLength: [500, "Description can not be more than 500 character"]
  }
});

module.exports = mongoose.model("stream", StreamSchema);
