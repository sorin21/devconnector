const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
// DB Config
const { mongoURI } = require('./config/keys');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log('There was an error: ', error));

// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// for deploy heroku process.env.PORT
// locally port 5000
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))