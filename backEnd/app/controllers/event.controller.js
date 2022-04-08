// const db = require("../models");
// const Event = db.events;
const { authJwt } = require("../middleware");
const Event = require("../models/event.model.js");

/*
var multer  = require('multer');

// Picture Storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
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

// Create and Save a new Event
exports.create = (req, res) => {
  
}; */

// Retrieve all Events from the database.
exports.findAll = (req, res) => {
  
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  // populate Events with Username of Creator ID and remove id from response

  
 
  Event.find(condition)
    .populate('creator', ['profilePicURL','username'])
    // .populate('creator', 'username')
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving events."
      });
    });
};

// Find a single Event with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Event.findById(id)
    .populate('creator', ['profilePicURL','username'])
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Event with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Event with id=" + id });
    });
};

// Update a Event by the id in the request
exports.update = (req, res) => {
  // console.log("req.body.creator._id: ", req.body.creator._id)
  // console.log(req.userId)
  //console.log("authJwt.currentUser: ", authJwt) // TODO: how to reliably get current userid?
  // get current user id from jwt
  // console.log("authJwt.getCurrentUserID", authJwt.getCurrentUserID())
  // console.log("authJwt", authJwt)
  // console.log(authJwt.isAdmin)


  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  


  if(!(authJwt.isAdmin || (authJwt.isOrganizer && req.userId == req.body.creator._id))) {
    return res.status(401).send({
      message: "Not Authorized"
    });
  } else {
    console.log("user is authorized")
  }

  const id = req.params.id;
  console.log("req.body: ", req.body)

  Event.findByIdAndUpdate(id, req.body)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Event with id=${id}. Maybe Event was not found!`
        }); 
      }
      else {
       res.send({ message: "Event was updated successfully."})
      }
    })

    .catch(err => {
      res.status(500).send({
        message: "Error updating Event with id=" + id
      });
    });
  };

exports.delete = (req, res) => {
  const id = req.params.id;
  console.log("req.userId", req.userId)
  Event.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
        });
      }
      else if(!authJwt.isOrganizer && req.userId !== data.creator) {
          res.status(401).send({
            message: "Not Authorized"
          });
      } else {
      Event.findByIdAndRemove(id)
        .then(data => {
          res.send({
            message: "Event was deleted successfully!"
          }
        );
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Event with id=" + id
          });
        });
      }})
    .catch(err => {
      console.log("error", err)
      res.status(500).send({
        message: "Could not delete Event with id=" + id
      });
    });
  }

exports.deleteAll = (req, res) => {
  Event.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Events were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all events."
      });
    });
};

exports.findAllPublished = (req, res) => {
  Event.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving events."
      });
    });
};


exports.getCategories = (req, res) => {
  res.status(200).send(Event.schema.path('category').enumValues);
};