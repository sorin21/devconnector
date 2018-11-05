const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// used for protected routes
const passport = require('passport');

// Post model
const Post = require('../../models/Post');

// Validation
const validatePostInput = require('../../validation/post');

// @route  GET api api/posts/test
// @desc   Tests post route
// @access Public route
router.get('/test', (req, res) => res.json({ msg: "Posts Works" }));


// @route  POST api api/posts
// @desc   Create post
// @access Private route
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
})

module.exports = router;