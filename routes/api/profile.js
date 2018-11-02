const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// used for protected routes
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');

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
    // populate from user
    .populate('user', ['name', 'avatar'])
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

// @route  POST api api/profile
// @desc   Create or Edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errros with 400 status
    return res.status(400).json(errors);
  }

  // get fields
  const profileFields = {};
  profileFields.user = req.user.id;

  // Check if the handle is send by the form
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.status) profileFields.status = req.body.status;

  // Skills - split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  };

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.instagram) profileFields.gitHub = req.body.gitHub;

  // Find the logged in user by id
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        // Update profile
        // we want to update user, set profileFields
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true })
          .then(profile => {
            // respond with the profile
            res.json(profile);
          })
      } else {
        // Create profile

        // Check if handle exist
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }

            // Save Profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          })
      }
    })
});

module.exports = router;