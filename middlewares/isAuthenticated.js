const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    tokenBearer = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: tokenBearer });

    if (!user) {
      res.status(401).json(`Utilisateur non authentifié, action impossible`);
    } else {
      req.user = user;
      return next();
    }
  } else {
    res
      .status(401)
      .json(`Aucun tocken transmis, utilisateur impossible à authentifier`);
  }
};

module.exports = isAuthenticated;
