const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.events = require("./event.model.js")(mongoose);
db.user = require("./user.model");
db.role = require("./role.model");
db.ROLES = ["admin", "moderator", "organizer", "user"];

module.exports = db;