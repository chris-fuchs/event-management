const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
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
    "/api/test/favoriteEvent/:id",
    [authJwt.verifyToken, authJwt.isUser],
    controller.addFavEvent
  );
}
