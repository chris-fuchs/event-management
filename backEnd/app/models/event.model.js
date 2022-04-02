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
    category: {
      type: String,
      enum: ["sport", "music", "movie", "party", "other"]
    },
    published: Boolean
  },
  { timestamps: true }
  )
);
module.exports = Event;

//import { User } from '../models/user.model';
/*module.exports = mongoose => {
  const Event = mongoose.model(
    "event",
    mongoose.Schema(
      {
        title: String,
        description: String,
        published: Boolean
      },
      { timestamps: true }
    )
  );

  return Event;
};*/





/*
const mongoose = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
      imageURL: String,
      published: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Event = mongoose.model("Event", schema);
  return Event;
};
*/