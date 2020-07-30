const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

const Admin = require('../models/admin');

/**POST /api/admin/register
 * Params :
 * username : string 
 * password : string
 * 
 * creates an admin acc in db and logs in the admin
 */
router.post('/register', async (req, res) => {
    let { username, password } = req.body;
    if (username === undefined || password === undefined) {
        return res.render('./error', { err: 'Please Provide an Username' });
    }
    try {
        let hash = bcrypt.hashSync(password, 10);
        let user = await Admin.create({ username: username, password: hash });

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
            return;
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.render('./error', { err: 'Username already taken' });
        } else {
            console.error(err);
            return res.render('./error', { err: 'Server Error' });
        }
    }
});

/** POST /api/admin/login
 * Params :
 * username : String
 * password L String
 */
router.post('/login', (req, res, next) => {
    // authenticate using passport local strategy
    passport.authenticate('local', function (err, admin, info) {
        if (err) {
            return next(err);
        }
        if (!admin) {
            // as no admin is returned , must be some error in credentials
            res.render('./error', { err: "Incorrect Credential" });
            return;
        }
        // log in the admin
        req.logIn(admin, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;