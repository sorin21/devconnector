const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');

const { secretOrKey } = require('../config/keys');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

const passport = (passport) => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload)
    // console.log(done)
    // Get the User that is being send to jwt_payload
    User.findById(jwt_payload.id )
      .then((user) => {
        if (user) {
          // return the user
          // null is the error
          return done(null, user);
        }
        // if the user is not found
        // null for error
        // false for user
        return done(null, false);
      })
      .catch(error => {
        console.log(error);
        return done(error);
      });
  }));
}

module.exports = passport;

