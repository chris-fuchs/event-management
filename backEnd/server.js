const express = require("express");
const cors = require("cors");
const path = require("path");  
var bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: ["http://localhost:4200","http://localhost:38365"]
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

require("./app/routes/event.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8080;

const db = require("./app/models");
const { mongoose } = require("./app/models");
const { organizerBoard } = require("./app/controllers/user.controller");
const Role = db.role;
const User = db.user;
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });


  function initial() {
    userRoleID = "";
    orgRoleID = "";
    modRoleID = "";
    adminRoleID = "";
    
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'user' to roles collection");
          // set uerRoleID from just saved role
        }).then(role => {
          userRoleID = role._id;
          console.log("userRoleID set to: " + userRoleID);
        });

        new Role({
          name: "organizer"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'organizer' to roles collection");
        }).then(role => {
          orgRoleID = role._id;
          console.log("orgRoleID set to: ", orgRoleID);
        });


        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'moderator' to roles collection");
        }).then(role => {
          modRoleID = role._id;
          console.log("modRoleID set to: ", modRoleID);
        });

        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin' to roles collection");
        }).then(role => {
          adminRoleID = role._id;
          console.log("adminRoleID set to: ", adminRoleID);
        });
      }
    });

    console.log("userRoleID precheck: " + userRoleID);
    if(userRoleID === "") {
      Role.find({name: "user"}, (err, role) => {
        if(!err && !role.length) {
          console.log("role: ", role);
          userRoleID = role._id.toString();
          console.log("userRoleID set to: " + userRoleID);
        } else {
          console.log("userRoleID not set");
        }
      });
    }

    if(orgRoleID === "") {
      Role.findOne({name: "organizer"}, (err, role) => {
        if(!err) {
          orgRoleID = role._id;
        }
      });
    }

    if(modRoleID === "") {
      Role.findOne({name: "moderator"}, (err, role) => {
        if(!err) {
          modRoleID = role._id;
        }
      });
    }

    if(adminRoleID === "") {
      Role.findOne({name: "admin"}, (err, role) => {
        if(!err) {
          adminRoleID = role._id;
        }
      });
    }

    console.log("userRoleID after setting: " + userRoleID);


    User.exists({ username: "admin" }, (err, exists) => {
      console.log()
      if (!err && !exists) {
        const password = bcrypt.hashSync("adminadmin", 8)
        console.log(password)
        new User({
          username: "admin5",
          email: "admin@admin.com",
          password: password,
         roles: [ userRoleID, orgRoleID, modRoleID, adminRoleID ]
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'admin' to users collection");
        });
      } else {
        console.log("admin user already exists");
      }
    })
  }


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  initial();
});