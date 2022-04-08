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

// IDs can vary. TODO: getRoleID by searching for name
// org: 620e603c8c7e915ae7034ca6
// usr: 620e603c8c7e915ae7034ca5
// mod: 620e603c8c7e915ae7034ca7

exports.adminBoard = (req, res) => {
  let roleCondition;
  let isAdmin = false;

  Users.findById(req.userId)
  .populate('roles', 'name') 
  .exec()
  .then(user => {
    for (let i = 0; i < user.roles.length; i++) {
      if (user.roles[i].name === "admin") {
        isAdmin = true;
        // console.log("!!isAdmin: ",isAdmin)
        break;
      }
    }

    if(isAdmin) {
      roleCondition = { roles: { $in: ['620e603c8c7e915ae7034ca5','620e603c8c7e915ae7034ca6', '620e603c8c7e915ae7034ca7'] } };
      // console.log("adminBoard: is admin!");
    } else {
      roleCondition = { roles: { $in: ['620e603c8c7e915ae7034ca6', '620e603c8c7e915ae7034ca5'] } };
      // console.log("adminBoard: is not admin!");
    }

    Users.find(roleCondition)
        .select('-password')
        .populate('roles', 'name')    
        .exec()
        .then(docs => {
            if(docs.length >= 0) {
              const responseUser = {
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
              res.status(200).json(responseUser);
          }
          
    })
    .catch(err => {
        console.log("adminBoard: ",err);
        res.status(500).json({
            error: err
        });
    });
  })
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
      
      
exports.demoteModToUser = (req, res) => {
  const id = req.params.id;
  Users.findById(id, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          user.roles.pull({ _id: '620e603c8c7e915ae7034ca7' }); //TODO: getRoleID by searching for name
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

exports.addFavEvent = (req, res) => {
  console.log("addFavEvent triggered")
  userID = req.userId
  eventID = req.params.id
  console.log("addFavEvent: ",userID,eventID);
  Users.findById(userID, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          if (user.favEvents.indexOf(eventID) == -1) {
            user.favEvents.push(eventID);
            user.save(function(error) {
              if (error) {
                res.status(500).json({
                  error: err.message
                });
              } else {
                res.status(200).json({
                  message: "Event added to favorites"
                });
              }
            }
          ) } else {
            res.status(200).json({
              message: "Event already in favorites"
            });
          }
        }
      }
      )
    }

    exports.removeFavEvent = (req, res) => {
      console.log("removeFavEvent triggered")
      userID = req.userId
      eventID = req.params.id
      console.log("removeFavEvent: ",userID,eventID);
      Users.findById(userID, function (error, user) {
            if (error) {
              res.status(500).json({
                error: err.message
              });
            } else {
            if (user.favEvents.indexOf(eventID) != -1) {
              user.favEvents.pull(eventID);
              user.save(function(error) {
                if (error) {
                  res.status(500).json({
                    error: err.message
                  });
                } else {
                  res.status(200).json({
                    message: "Event removed from favorites"
                  });
                }
              }
            ) } else {
              res.status(200).json({
                message: "Event not in favorites"
              });
            }
          }
        }
        )
      }
      

exports.getFavEventList = (req, res) => {
  userID = req.userId
  Users.findById(userID, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          eventList = user.favEvents;
          res.status(200).send(eventList)
        }
      })};

      exports.getProfilePicture = (req, res) => {
        userID = req.userId
        Users.findById(userID, function (error, user) {
              if (error) {
                res.status(500).json({
                  error: err.message
                });
              } else {
                 profilePicURL = user.profilePicURL;
                 res.status(200).send(profilePicURL)
              }
            })}
