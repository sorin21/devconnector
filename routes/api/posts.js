const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// used for protected routes
const passport = require('passport');

// Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route  GET api api/posts/test
// @desc   Tests post route
// @access Public route
router.get('/test', (req, res) => res.json({ msg: "Posts Works" }));


// @route  GET api api/posts/id
// @desc   Get post by id
// @access Public route
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(error => res.status(404).json({ nopostfound: 'No posts found' }));
});


// @route  GET api api/posts
// @desc   Get posts
// @access Public route
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(error => res.status(404).json({ nopostsfound: 'No posts found with that ID' }));
});


// @route  POST api api/posts
// @desc   Create post
// @access Private route
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  // Check Validation
  if (!isValid) {
    // Id any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});


// @route  DELETE api api/posts/:id
// @desc   Delete a post
// @access Private route
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for the post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' })
          }

          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(error => res.status(404).json({ postnotfound: 'No post found' }));
    })
});

module.exports = router;