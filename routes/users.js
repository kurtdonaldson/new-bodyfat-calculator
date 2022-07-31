const express = require('express');
const router = express.Router();
// handling errors use catch
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register');
});

// registering a new user. 
router.post('/register', catchAsync(async(req, res) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.flash('success', 'WELCOME TO THE BODYFAT CALCULATOR!');
    res.redirect('/');
    } catch(e){
        console.log(e.message)
        req.flash('error', e.message);
        res.redirect('register')
    }
}));

// logging in client
router.get('/login', (req, res) =>{
   res.render('users/login');
})


//passport.authenticate uses middleware, Expects strategy e.g. local.
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
     req.flash('success', 'Welcome Back!');
     res.redirect('/');
})

module.exports = router;

// logging out
// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', "Goodbye!");
//     res.redirect('/login');
// })