const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { secretOrKey } = require('../../config/keys');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginrInput = require('../../validation/login');

// Load user model
const User = require('../../models/User');

// @route  GET api api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res) => res.json({ msg: "Users Works" }));

// @route  POST api api/users/register
// @desc   Register user
// @access Public
router.post('/register', (req, res) => {
  const { isValid, errors } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    // return all errors
    return res.status(400).json(errors);
  }
  // check if the email exists
  User.findOne({ email: req.body.email })
    .then((user) => {
      //if is that user with that email 
      errors.email = 'Email already exists';
      if (user) {
        return res.status(400).json(errors);
      }
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'g', //Rating
        d: 'mm', // Default
      })

      // create the new User
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      // generate a salt with bcrypt
      bcrypt.genSalt(10, (error, salt) => {
        // create the hash
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // set the new user to hash
          newUser.password = hash;
          // save it ( mongoose save )
          newUser.save()
            // get the response wirh the user
            .then(user => res.json(user))
            .catch(err => console.log('Error from hash', err))
        })
      })
    })
    .catch(error => {
      console.log('There is an error on check email, users.js: ', error)
    });
});


// @route  GET api api/users/login
// @desc   Login user / Returning JWT token
// @access Public
router.post('/login', (req, res) => {
  const { isValid, errors } = validateLoginrInput(req.body);

  // Check validation
  if (!isValid) {
    // return all errors
    return res.status(400).json(errors);
  }
  // email and pass from what user tyes
  const email = req.body.email;
  const password = req.body.password;

  // Find the user by email
  User.findOne({ email })
    .then((user) => {
      // Check if ther is a user
      if (!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors);
      }

      // Check password from above against 
      // the user.password, hashed one from db
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          // if is matched user passed
          if (isMatch) {
            // user Matched
            // Create JWT payload
            // payload is what we want to include in token
            const payload = { id: user.id, name: user.name, avatar: user.avatar };

            // Sign Token
            // 3600 second is 1h
            jwt.sign(
              payload,
              secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                })
              }
            );

            // return res.json({ msg: 'Success' })
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        })
    })
});

// @route  GET api api/users/current
// @desc   Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  // res.json(req.user);
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;