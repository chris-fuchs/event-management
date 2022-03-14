const { response } = require("express");
const { authJwt } = require("../middleware");
var mongoose = require('mongoose');
const db = require("../models");
const Users = db.user;
const Roles = db.role;
const Events = require("../models/event.model")

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  //res.status(200).send("Admin Content.");
  console.log("adminboard: ",req.userId)
  const name = req.query.name;
  const condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
  let users = Users.find(condition)
      .select('-password')
      .populate('roles', 'name')
      .exec()
      .then(docs => {
          const response = {
              count: docs.length,
              users: docs.map(doc => {
                  return {
                    id: doc._id,
                    username: doc.username,
                    email: doc.email,
                    roles: doc.roles.map(role => role.name)
                  }
              })
          }
          res.status(200).json(response);
          //res.send(response);
      })
      .catch(err => {


          res.status(500).json({
              error: err
          });
      });
};
    //const condition = name ? { name: { $regex: new RegExp(name), $options: "i" }, roles: { $nin: ['admin', 'moderator'] } } : { roles: { $nin: ['admin', 'moderator'] } };

exports.moderatorBoard = (req, res) => {
  //res.status(200).send("Moderator Content.");
  
  const name = req.query.name;
  //const condition = name ? { name: { $regex: new RegExp(name), $options: "i" }, roles: { $nin: ['admin', 'moderator'] } } : { roles: { $nin: ['admin', 'moderator'] } };
  const condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  let users = Users.find(condition)
      .select('-password')
      .populate('roles', 'name')
      .exec()
      .then(docs => {
          const response = {
              count: docs.length,
              users: docs.map(doc => {
                  return {
                    id: doc._id,
                    username: doc.username,
                    email: doc.email,
                    roles: doc.roles.map(role => role.name)
                  }
              })
          }
          res.status(200).json(response);
          //res.send(response);
      })
      .catch(err => {


          res.status(500).json({
              error: err
          });
      });
    }



exports.organizerBoard = (req, res) => {
  // get All events where authJwt.currentUser.id equals event.creator and send them back
  // let bla = req.userId.toString()
  // let temp = mongoose.Types.ObjectId(req.userId)
  // console.log("organizerBoard: ",req.userId)
  // mongoose query, pass variable instead of string
  Events.find( { creator: mongoose.Types.ObjectId(req.userId) })
  .exec()
    .then(data => {
      console.log("data: ",data)
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving events."
      });
    });
}
  


exports.deleteUser = (req, res) => {
  const id = req.params.id;
  console.log("deleteUser: ",id);
  Users.findByIdAndRemove(id)
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
}

exports.promoteUserToOrganizer = (req, res) => {
  const id = req.params.id;
  console.log("promoteUserToModerator: ",id);
  Users.findById(id, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          // remove user role
          user.roles.pull({ _id: '620e603c8c7e915ae7034ca5' });
          // add organizer role
          user.roles.push({ _id: '620e603c8c7e915ae7034ca6' });

          user.save(function(error) {
            if (error) {
              res.status(500).json({
                error: err.message
              });
            } else {
              res.status(200).json({
                message: "User promoted"
              });
            }
          } 
        ) }
      }
      )
    }

exports.promoteUserToModerator = (req, res) => {
  const id = req.params.id;
  console.log("promoteUserToModerator: ",id);
  // remove role model reference with name 'user' and ad role model reference with name 'moderator'´with mapping
  Users.findById(id, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          // remove user role
          user.roles.pull({ _id: '620e603c8c7e915ae7034ca5' });
          // add moderator role
          user.roles.push({ _id: '620e603c8c7e915ae7034ca7' });

          user.save(function(error) {
            if (error) {
              res.status(500).json({
                error: err.message
              });
            } else {
              res.status(200).json({
                message: "User promoted"
              });
            }
          } 
        ) }
      }
      )
    }
        /*populate('roles', 'name')
        .findByIdAndUpdate(id, { $pull: { roles: { name: 'user' } }, $addToSet: { roles: { $each: ['moderator'] } } }, { new: true })
        .exec()
        
        .save()
        .then(result => {
          res.status(200).json({
            message: "User promoted"
          });
        }
        )
        .catch(err => {
          res.status(500).json({
            error: err.message
          });
        }*/
      
      
exports.demoteModToUser = (req, res) => {
  const id = req.params.id;
  // remove role model reference with name 'user' and ad role model reference with name 'moderator'´with mapping
  Users.findById(id, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          // remove user role
          user.roles.pull({ _id: '620e603c8c7e915ae7034ca7' });
          // add moderator role
          user.roles.push({ _id: '620e603c8c7e915ae7034ca5' });

          user.save(function(error) {
            if (error) {
              res.status(500).json({
                error: err.message
              });
            } else {
              res.status(200).json({
                message: "User demoted"
              });
            }
          } 
        ) }
      }
      )
    }

exports.demoteOrgToUser = (req, res) => {
  const id = req.params.id;
  // remove role model reference with name 'user' and ad role model reference with name 'moderator'´with mapping
  Users.findById(id, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          // remove user role
          user.roles.pull({ _id: '620e603c8c7e915ae7034ca6' });
          // add moderator role
          user.roles.push({ _id: '620e603c8c7e915ae7034ca5' });

          user.save(function(error) {
            if (error) {
              res.status(500).json({
                error: err.message
              });
            } else {
              res.status(200).json({
                message: "User demoted"
              });
            }
          } 
        ) }
      }
      )
    }