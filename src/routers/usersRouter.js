const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { redirectHome } = require('../middlewares/redirect');
const { authUser } = require('../middlewares/auth');

const router = new express.Router();

//sign up form
router.get('/signup', redirectHome, (req, res) => {
  res.status(200).render('signup', { error: null, user: null });
});

//sign up
router.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    req.session.userId = user._id;
    res.status(201).redirect('/');
  } catch (e) {
    res.status(503).render('signup', { error: e, user: null });
  }
});

//sign in form
router.get('/signin', redirectHome, (req, res) => {
  res.status(200).render('signin', { error: null, user: null });
});

//sign in
router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('Please check your credentials');
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      throw new Error('Please check your credentials');
    }

    req.session.userId = user._id;
    res.status(200).redirect('/');
  } catch (e) {
    res.status(401).render('signin', { error: e, user: null });
  }
});

//logout user
router.post('/logout', (req, res) => {
  //destroy on server side
  req.session.destroy((error) => {
    if (error) {
      return res.status(503).redirect('/');
    }
    //destroy on client side
    res.clearCookie(process.env.SESS_NAME);
    res.status(200).redirect('/signin');
  });
});

//get user's account
// router.get('/user/account', authUser, (req, res) => {});

//delete user's account
// router.delete('/user/delete', authUser, (req, res) => {});

module.exports = router;
