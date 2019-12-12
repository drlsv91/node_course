// 401->unauthorize
// 403->forbidden
// 500->internal server error

module.exports = function(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access Denied!.");
  next();
};
