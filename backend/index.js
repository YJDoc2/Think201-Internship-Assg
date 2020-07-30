const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoCfg = require('./config/db');
//const session = require('express-session'); //TODO
//const passport = require('passport'); //TODO


const app = express();
const EXPRESS_PORT = process.env.PORT || 8000;

useNewUrlParser: true,
  mongoose.connect(mongoCfg.db, {
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

let db = mongoose.connection;

// Log error and exit if error in connection
db.on('error', (err) => {
  console.error('Error in Connecting to Database at link ' + mongoCfg.db);
  console.error(err);
  console.log('DB connection Error... Exiting');
  process.exit(1); //exit gracefully
});

// Successful connection
db.once('open', () => {
  console.log('Connected to Database at link ' + mongoCfg.db);
});

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// EJS engine
app.set('views', path.join(__dirname, '..', 'frontend'));
app.set('view engine', 'ejs');

// set up static and frontend routes
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// set up routes
app.use('/api/students', require('./routes/students'));

// start server
app.listen(EXPRESS_PORT, () => {
  console.log(`Express listening on Port ${EXPRESS_PORT}...`);
});
