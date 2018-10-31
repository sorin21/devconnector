const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// used for protected routes
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route  GET api api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/test', (req, res) => res.json({ msg: "Profile Works" }));

// @route  GET api api/profile
// @desc   Get current users profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  // req.user will have all the user info
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        // 404 not found
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;