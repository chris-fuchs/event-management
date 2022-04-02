const { authJwt } = require("../middleware");
module.exports = function(app) {
  const events = require("../controllers/event.controller.js");

  var router = require("express").Router();
  // var express = require("express");
  const db = require("../models");
  //const Event = db.events;
  const Event = require("../models/event.model.js");
  const Users = db.user;
  var multer  = require('multer');

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
      //cb(null, 'app/public/images');
    },
    filename: (req, file, cb) => {
      console.log("diskStoragefile:");
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

var upload = multer({storage: storage});

  // Create a new Event
router.post("/",  [authJwt.verifyToken, authJwt.isOrganizer], upload.single('file'),function(req, res, next) {
    
  if (!req.body.title) {
    res.status(400).send({ message: "No body.title found" });
    return;
  }
  
  // Prepare link
  var tempImageURL = ''
  if(req.file) {
    tempImageURL = 'http://localhost:8080/images/' + req.file.filename
  }
  
  // hggggftrrrrrrrrrr <-- 

  console.log(req.body.creator);
  // const user 
  
  // Users.findById(req.body.creator)
  // .then(user => {
  //   if(!user) {
  //     res.status(400).send({ message: "No user found" });
  //     return;
  //   }

  // console.log("user: " + user.username)

  // Create Event
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    imageURL: tempImageURL,
    published: req.body.published ? req.body.published : false,
    creator: req.body.creator,
    category: req.body.category
    //creator: Users.findById(req.body.creator)
  });

  // Users.findById(req.body.creator, function(err, user) {
  //   if (err) {
  //     res.status(500).send({ message: err });
  //     return;
  //   }
  //   if (!user) {
  //     return res.status(404).send({ message: "User Not found." });
  //   }
  //   console.log("creator user: ",user)
  //   event.creator = user;
  //   console.log("event creator: ",event.creator)
  // })

  console.log("Event: ",event)

  // Save Event in the database
  event.save()



  //event.save()

    //.select('creator','-password')
    //.populate('roles', 'name')
    //.exec()
    .then(data => {
      //res.send(data);

      // res.status(200).send({
      //   message: "Event created successfully",
      // });
      // let url = 'events/' + data._id.toString();
      // console.log("data: ",data)
      // console.log("id: ",data._id.toString())
      // res.redirect("200", url);
      res.status(200).send(data);

    })
    .catch(err => {
      console.log("err: ",err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Event."
      });
    });
  });

  // Retrieve all Events
  router.get("/", events.findAll);

  // Retrieve all published Events
  router.get("/published", events.findAllPublished);

  // Retrieve a single Event with id
  router.get("/:id", events.findOne);

  // Update a Event with id
  router.patch("/:id", [authJwt.verifyToken, authJwt.isOrganizer || authJwt.isAdmin], events.update);

  // Delete a Event with id
  router.delete("/:id",[authJwt.verifyToken, authJwt.isOrganizer || authJwt.isAdmin], events.delete);

  // Delete all Events
  router.delete("/",[authJwt.verifyToken, authJwt.isAdmin], events.deleteAll);

  router.get("/info/categories", events.getCategories)

  app.use('/api/events', router);

  //app.use("/images", express.static(__dirname+"/public/images/"));
  //app.use("/images", express.static("home/chris/meanStackTest2/backEnd/app/public/images/"));
  //console.log(__dirname)
};



// module.exports = app => {
//   const events = require("../controllers/event.controller.js");

//   var router = require("express").Router();
//   var express = require("express");
//   const db = require("../models");
//   const Event = db.events;
//   var multer  = require('multer');

//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
//   });
  
//   var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './public/images');
//       //cb(null, 'app/public/images');
//     },
//     filename: (req, file, cb) => {
//       console.log("diskStoragefile:");
//       console.log(file);
//       var filetype = '';
//       if(file.mimetype === 'image/gif') {
//         filetype = 'gif';
//       }
//       if(file.mimetype === 'image/png') {
//         filetype = 'png';
//       }
//       if(file.mimetype === 'image/jpeg') {
//         filetype = 'jpg';
//       }
//       cb(null, 'image-' + Date.now() + '.' + filetype);
//     }
// });

// var upload = multer({storage: storage});

//   // Create a new Event
//   router.post("/",  [authJwt.verifyToken, authJwt.isOrganizer], upload.single('file'),function(req, res, next) {
//     console.log(`title: ${req.body.title}.`);
//     console.log(`file ${req.file}.`);
//     // Validate request
//   if (!req.body.title) {
//     console.log('no title found :(')
//     res.status(400).send({ message: "No body.title found" });
//     return;
//   }

  
//   if(!req.file) {
//     //return res.status(500).send({ message: 'Upload fail'});
//     console.log('no req file found :(')
//   }
  
//   // Create a Event
//   var tempImageURL = ''
//   if(req.file) {
//     tempImageURL = 'http://localhost:8080/images/' + req.file.filename
//   }

//   const event = new Event({
//     title: req.body.title,
//     description: req.body.description,
//     imageURL: tempImageURL,
//     published: req.body.published ? req.body.published : false
//   });

//   // Save Event in the database
//   event
//     .save(event)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Event."
//       });
//     });
//   });

//   // Retrieve all Events
//   router.get("/", events.findAll);

//   // Retrieve all published Events
//   router.get("/published", events.findAllPublished);

//   // Retrieve a single Event with id
//   router.get("/:id", events.findOne);

//   // Update a Event with id
//   router.put("/:id", events.update);

//   // Delete a Event with id
//   router.delete("/:id", events.delete);

//   // Create a new Event
//   router.delete("/", events.deleteAll);

//   app.use('/api/events', router);

//   //app.use("/images", express.static(__dirname+"/public/images/"));
//   //app.use("/images", express.static("home/chris/meanStackTest2/backEnd/app/public/images/"));
//   //console.log(__dirname)
// };