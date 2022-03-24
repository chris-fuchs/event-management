// const db = require("../models");
// const Event = db.events;

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
  
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  if(authJwt.isOrganizer && authJwt.currentUser.id !== req.body.creator) {
    return res.status(401).send({
      message: "Not Authorized"
    });
  }

  const id = req.params.id;

  Event.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Event with id=${id}. Maybe Event was not found!`
        }); }
        else if(authJwt.isOrganizer && authJwt.currentUser.id !== data.creator) {
          res.status(401).send({
            message: "Not Authorized"
          });
      } else res.send({ message: "Event was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Event with id=" + id
      });
    });
};

// Delete a Event with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;



  Event.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Event with id=${id}. Maybe Event was not found!`
        });
      }
      else if(authJwt.isOrganizer && authJwt.currentUser.id !== data.creator) {
          res.status(401).send({
            message: "Not Authorized"
          });
      } else {
        res.send({
          message: "Event was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Event with id=" + id
      });
    });
};

// Delete all Events from the database.
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

// Find all published Events
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