const mongoose = require("mongoose");
const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    title: String,
    description: String,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    imageURL: String,
    audioURL: String,
    category: {
      type: String,
      enum: ["sport", "music", "movie", "party", "other"]
    },
    tags: [String],
    published: Boolean
  },
  { timestamps: true }
  )
);
module.exports = Event;