const mongoose = require("mongoose");

const GUser = mongoose.model("googleuser", new mongoose.Schema({
  googleId: {
    type: String,
    required: true
  }
}));

module.exports = GUser;

