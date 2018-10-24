const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route  GET api api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res) => res.json({ msg: "Users Works" }));

// @route  GET api api/users/register
// @desc   Register user
// @access Public
router.post('/register', (req, res) => {
  // check if the email exists
  User.findOne({ email: req.body.email })
    .then((user) => {
      //if is that user with that email 
      if (user) {
        return res.status(400).json({ email: 'Email already exists' })
      }
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', //Rating
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
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // set the new user to hash
          newUser.password = hash;
          // save it ( mongoose save )
          newUser.save()
            // get the response wiht the user
            .then(user => res.json(user))
            .catch(err => console.log('Error from hash', err))
        })
      })
    })
    .catch(error => {
      console.log('There is an error on check email, users.js: ', error)
    });
});

module.exports = router;