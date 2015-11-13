var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/login', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email and Password required' });
    }
    passport.authenticate('local-login', function(err, user, info) {
        if (err) { 
            console.log(err);
            return res.status(400).json({ error: "Incorrect email or password" });
        }
        if (!user) {
            return res.status(400).json({ error: "Incorrect email or password" });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json({ redirect : '/admin/warrior'});
        });
    })(req, res);
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/#/admin/signup', // redirect back to the signup page if there is an error
    failureFlash : false // block flash messages
}));

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/auth', isLoggedIn, function(req, res, next) {
    return next();
});


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }
        
    // if they aren't redirect them to the home page
    res.json({ redirect : '/admin/login'});
}

module.exports = router;