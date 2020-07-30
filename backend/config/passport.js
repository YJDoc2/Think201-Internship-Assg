const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        // Match Username
        let query = { username: username };
        Admin.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { noUser: true });
            }
            // Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { wrongPwd: true });
                }
            });
        });
    }));


    // Helper Functions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Admin.findById(id, function (err, user) {
            done(err, user);
        });
    });
}