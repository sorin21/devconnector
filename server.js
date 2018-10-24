const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log('There was an error: ', error));

app.get('/', (req, res) => res.send('Hello world!!!'));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// for deploy heroku process.env.PORT
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))