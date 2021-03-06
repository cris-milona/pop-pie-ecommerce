const User = require('../models/user');

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.render('error', { user });
    }
    req.user = user;
    next();
  } catch (e) {
    res.sttaus(403).send(e);
  }
};

const authUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send(e);
  }
};

module.exports = {
  authAdmin,
  authUser,
};
