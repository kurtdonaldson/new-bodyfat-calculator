if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


// If we are not in production and are in development mode, we will require dotenv package. We'll take env variables and add them into process.env in node app. 


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bodyfat = require('./models/bodyfat');
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user');
const userRoutes = require('./routes/users');
const {isLoggedIn} = require('./middleware');
//mongo sanitize removes any keys containing prohibited characters. Helps prevent mongo inection. 
const mongoSanitize = require('express-mongo-sanitize');
const flash = require('connect-flash');
// const { measureMemory } = require('vm'); Not sure how this came up??

mongoose.connect('mongodb://localhost:27017/bodyfat-calculator');

//making db variable saves you from saying mongoose.connection.on
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(mongoSanitize());


// Below to parse the req.body. Telling express to parse the body
app.use(bodyParser.urlencoded({ extended: true }));

// I was stuck for a long time because I didn't have this. Stuck on the save button.
app.use(bodyParser.json());



// Below so I can use css stylesheet in ejs file. 
app.use(express.static(path.join(__dirname, 'public')));

    // extra security measureMemory. httpOnly. Ensure cookies sent securely and aren't accessed by unintented parties or scripts
    // Have expiry so someone doesn't just login once and stayed logged in
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}

app.use(session(sessionConfig));

app.use(flash());

// need to make sure passport.session is after sessionConfig. 
app.use(passport.initialize());
app.use(passport.session());
//we are getting passport to use the local strategy that we have downloaded and required. 
passport.use(new LocalStrategy(User.authenticate()));

//Tellling passport how to serialise user. How do we store and unstore a user in the session. 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// setting up middleware to use flash. 
app.use((req, res, next) => {
  // i now have access to currentUser from all ejs templates
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', userRoutes);

// clients used on ejs template to access this data. 
// isLoggedIn. Middleware being exported from middleware.js file. Checks if user is logged in. 
app.get('/', isLoggedIn, async (req, res) => {
    const clients = await Bodyfat.find({});
    res.render('home', { clients })
})

// creating new client. this is working
//client.author - save the user to the client being created. 
app.post('/', isLoggedIn, async(req, res) => { 
   const client = new Bodyfat(req.body);
    client.author = req.user._id;
    await client.save();
    req.flash('success', 'Successfully created a new client!');
    res.redirect("/");
})

// delete user from DB
// Using clientCheck to determine that clients author and user id are the same so that only the user can alter the clients data. Extra layer of protection. 
app.delete("/clients", isLoggedIn, async(req, res) => {
  const clientCheck = await Bodyfat.findOne({name: req.body.name});
    if(!clientCheck.author.equals(req.user._id)){
      console.log('YOU DO NOT HAVE PERMISSION TO DO THAT!');
    } else {
      const clients = await Bodyfat.deleteOne(req.body)
        .then(() => {
          res.json(`Deleted user`);
        })
        .catch(() => {
          res.redirect("/");
        });
      }
    });

// add new test to client and save to DB
// Using clientCheck to determine that clients author and user id are the same so that only the user can alter the clients data. Extra layer of protection. 
// Working except still figuring out how to display flash. 
app.put("/clients", isLoggedIn, async(req, res) => {
    const clientCheck = await Bodyfat.findOne({name: req.body.name});
    if(!clientCheck.author.equals(req.user._id)){
      console.log('YOU DO NOT HAVE PERMISSION TO DO THAT!');
    } else {
      const clients = await Bodyfat.findOneAndUpdate(
          { name: req.body.name },
          {
            $push: {
              test: {
                date: req.body.date,
                bodyfat: req.body.bodyfat,
                weight: req.body.weight,
                leanMass: req.body.leanMass,
                classification: req.body.classification, 
              },
            },
          },
          {
            upsert: true,
          }
        )
        .then(() => {
          res.json("Success");
        })
        .catch(() => {
          res.redirect("/");
        });
    }  
    });

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
});

