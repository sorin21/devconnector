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


// @route  POST api api/posts/like/:id
// @desc   Like a post
// @access Private route
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if the user liked already the post
          // > 0 means the user already liked it
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this post' });
          }

          // Add the user id to likes array
          post.likes.unshift({ user: req.user.id });

          // Save it to database
          post.save().then(post => res.json(post));
        })
        .catch(error => res.status(404).json({ postnotfound: 'No post found' }));
    })
});


// @route  POST api api/posts/unlike/:id
// @desc   Unlike a post
// @access Private route
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check if the user liked already the post
          // > 0 means the user already liked it
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not liked this post' });
          }

          // Get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of the array
          post.likes.splice(removeIndex, 1);

          // Save it to database
          post.save().then(post => res.json(post));
        })
        .catch(error => res.status(404).json({ postnotfound: 'No post found' }));
    })
});


// @route  POST api api/posts/comment/:id
// @desc   Add comment to a post
// @access Private route
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);
  // Check Validation
  if (!isValid) {
    // Id any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      // Add to comments array
      post.comments.unshift(newComment);

      // Save to database
      post.save().then(post => res.json(post));
    })
    .catch(error => res.status(404).json({ postnotfound: 'No post found' }));
});


// @route  DELETE api api/posts/comment/:id/:comment_id
// @desc   Delete comment to a post
// @access Private route
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // Check to see if the comment exists
      // if this is true means the comment doens't exists
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotexists: 'This comment does not exists' });
      }

      // Get the remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      // Splice out of the array
      post.comments.splice(removeIndex, 1);

      // Save it to database
      post.save().then(post => res.json(post));
    })
    .catch(error => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;