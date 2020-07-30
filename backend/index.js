const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoCfg = require('./config/db');
const session = require('express-session');
const passport = require('passport');

const app = express();
const EXPRESS_PORT = process.env.PORT || 8000;

useNewUrlParser: true,
  mongoose.connect(mongoCfg.db, {
    useNewUrlParser: true,
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


// Sessions and Passport Initialisations
app.use(
  session({
    secret: 'Secrete',
    resave: true,
    saveUninitialized: false,
    ephemeral: true
  })
);

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set user in every request
app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
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
app.use('/api/images', require('./routes/image'));
app.use('/api/admin', require('./routes/admin'));

// start server
app.listen(EXPRESS_PORT, () => {
  console.log(`Express listening on Port ${EXPRESS_PORT}...`);
});
