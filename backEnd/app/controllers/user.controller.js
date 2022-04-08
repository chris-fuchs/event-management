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

// org: 620e603c8c7e915ae7034ca6
// usr: 620e603c8c7e915ae7034ca5
// mod: 620e603c8c7e915ae7034ca7

exports.adminBoard = (req, res) => {
  // console.log("req.permission ", req.permission)
  // console.log("reqid: ", req.params.id)
  // console.log("req.userId: ", req.userId)
  // console.log("adminBoard triggered with userID: ",req.userId)
  // let a = authJwt.isAdmin

  // console.log("isAdmin: ",authJwt.isAdmin == true)
  // console.log("isMod: ",authJwt.isMod == true)
  // console.log("isModerator: ",authJwt.isModerator == true)

  // if(req.user.roles === 'true'){
  //   console.log("is admin yes!")
  // }

  // if(req.user.isMod === 'true'){
  //   console.log("is mod yes!")
  // }

  // if(req.user.isModerator === 'true'){
  //   console.log("is moderator yes!")
  // }


  // if(authJwt.isAdmin) {
  //   console.log("adminBoard is admin")
  // } else {
  //   console.log("adminBoard is not admin")
  // }

  // if(authJwt.isModerator) {
  //   console.log("adminBoard is mod")
  // } else {
  //   console.log("adminBoard is not mod")
  // }

  // if(authJwt.isOrganizer) {
  //   console.log("adminBoard is org")
  // } else {
  //   console.log("adminBoard is not org")
  // }

  // if(authJwt.isUser) {
  //   console.log("adminBoard is usr")
  // } else {
  //   console.log("adminBoard is not usr")
  // }

  
  //res.status(200).send("Admin Content.");
  let roleCondition
  if(req.permission === "admin") {

    // !!!! one of the below not all
    roleCondition = { roles: { $in: ['620e603c8c7e915ae7034ca5','620e603c8c7e915ae7034ca6', '620e603c8c7e915ae7034ca7'] } };
    console.log("adminBoard: is admin!");
  } else {
    // roleCondition = { roles: { $nin: ['organizer', 'user'] } };
    roleCondition = { roles: { $in: ['620e603c8c7e915ae7034ca6', '620e603c8c7e915ae7034ca5'] } };
    console.log("adminBoard: is not admin!");
  }

  Users.find(roleCondition)
      .select('-password')
      .populate('roles', 'name')    
      // .find(roleCondition)
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
            //console.log("adminBoard: ",responseUser);
             res.status(200).json(responseUser);
        }
        
  })
  .catch(err => {
      console.log("adminBoard: ",err);
      res.status(500).json({
          error: err
      });
  });

  } 

//   console.log("adminboard: ",req.userId)
//   const name = req.query.name;
//   const condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
//   let users = Users.find(condition)
//       .select('-password')
//       .populate('roles', 'name')
//       .exec()


//   // users.find(roles.name?.exists("admin"))


//       .then(docs => {
//           // only send back if role.name equals USER or ORGANIZER
          
//           const response = {
//               count: docs.length,
//               users: docs.map(doc => {
//                   return {
//                     id: doc._id,
//                     username: doc.username,
//                     email: doc.email,
//                     roles: doc.roles.map(role => role.name)
//                   }
//               })
//           }
//           res.status(200).json(response);
//       })
//       .catch(err => {


//           res.status(500).json({
//               error: err
//           });
//       });
// };
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
  Users.findById(id, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          // remove user role
          user.roles.pull({ _id: '620e603c8c7e915ae7034ca7' }); //TODO: getRoleID by searching for name
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
          // check if event is already in favorites
        //if (!user.favEvents.includes(eventID)) {
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
              // check if event is already in favorites
          //if (!user.favEvents.includes(eventID)) {
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
      


// exports.addFavEvent = (req, res) => {
//   // get User from Webtoken
//   userID = req.userId
//   console.log("addFavEvent: ",userID);
//   // get Event from req.body
//   eventID = req.body.eventID
//   console.log("addFavEvent: ",eventID);
//   // get User from DB
//   Users.findById(userID)
//   .populate('favEvents')
//   .exec()
//     .then(user => {
//       // check if event is already in favorites
//       for (var i = 0; i < user.favEvents.length; i++) {
//         if (user.favEvents[i]._id == eventID) {
//           console.log("Event already in favorites");
//           return res.status(200).json({
//             message: "Event already in favorites"
//           });
//         }
//       }
//       // add event to favorites
//       user.favEvents.push(eventID);
//       user.save(function(error) {
//         if (error) {
//           res.status(500).json({
//             error: err.message
//           });
//         } else {
//           res.status(200).json({
//             message: "Event added to favorites"
//           });
//         }
//       } 
//     ) }
//     )
//     .catch(err => {
//       res.status(500).json({
//         error: err.message
//       });
//     });
// }

exports.getFavEventList = (req, res) => {
  // console.log("getFavEventList triggered")
  userID = req.userId
  // console.log("getFavEventList: ",userID);
  // find and set event list
  Users.findById(userID, function (error, user) {
        if (error) {
          res.status(500).json({
            error: err.message
          });
        } else {
          // set event list
          eventList = user.favEvents;
          // console.log("getFavEventList: ",eventList);
          // res.status(200).json({
            //message: "Event list",
            // eventList: eventList
          // });
          res.status(200).send(eventList)
        }
      })};

      exports.getProfilePicture = (req, res) => {
        //console.log("getProfilePicture triggered")
        userID = req.userId
        //console.log("getProfilePicture: ",userID);
        // find and set event list
        Users.findById(userID, function (error, user) {
              if (error) {
                res.status(500).json({
                  error: err.message
                });
              } else {
                // set event list
                profilePicURL = user.profilePicURL;
                //console.log("getProfilePicture: ",profilePicURL);
                // res.status(200).json({
                  //message: "Event list",
                  // eventList: eventList
                // });
                res.status(200).send(profilePicURL)
              }
            })}
