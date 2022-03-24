const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
var multer  = require('multer');
const User = require("../models/user.model.js");

  
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


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/api/test/org",
    [authJwt.verifyToken, authJwt.isOrganizer]  ,
    controller.organizerBoard
  );

  app.put(
    "/api/test/user2org/:id",
    [authJwt.verifyToken, authJwt.isOrganizer || authJwt.isAdmin],
    controller.promoteUserToOrganizer
  );
  app.put(
    "/api/test/user2mod/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.promoteUserToModerator
  );

  app.put(
    "/api/test/demoteOrgToUser/:id",
    [authJwt.verifyToken, authJwt.isAdmin || authJwt.isModerator],
    controller.demoteOrgToUser
  )

  app.put(
    "/api/test/demoteModToUser/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.demoteModToUser
  )

  app.delete(
    "/api/test/delete/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );

  app.put(
    "/api/test/addFavEvent/:id",
    [authJwt.verifyToken, authJwt.isUser],
    controller.addFavEvent
  );

  app.put(
    "/api/test/removeFavEvent/:id",
    [authJwt.verifyToken, authJwt.isUser],
    controller.removeFavEvent
  );

  app.get(
    "/api/test/favEventList/:id",
    [authJwt.verifyToken, authJwt.isUser],
    controller.getFavEventList
  );

  app.put(
    "/api/test/user/update/:id",
    [authJwt.verifyToken],
    upload.single('file'),
    function(req, res, next) {
      User.findById(req.params.id, function(err, user) {
        if (err) {
          res.send(err);
        }
        if (req.file) {
          user.profilePicURL = 'http://localhost:8080/images/' + req.file.filename;
        }
        if(req.body.username) {
        user.username = req.body.username;
        }
        if(req.body.email) {
          user.email = req.body.email;
        }
        user.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: "User updated!" });
        });
      }
    );
    });
  
  app.get(
    "/api/test/profilePicture/:id",
    [authJwt.verifyToken],
    controller.getProfilePicture
  );
}
