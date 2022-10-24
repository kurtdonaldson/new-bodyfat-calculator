if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// If we are not in production and are in development mode, we will require dotenv package. We'll take env variables and add them into process.env in node app.
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
//mongo sanitize removes any keys containing prohibited characters. Helps prevent mongo inection.
const mongoSanitize = require("express-mongo-sanitize");
const flash = require("connect-flash");
const dbUrl = require("./modules/mongo");
const MongoDBStore = require("connect-mongo");
const { findOne } = require("./models/bodyfat");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Below so I can use css stylesheet in ejs file.
app.use(express.static("public"));

//automatically enables all 11 middleware that helmet comes with.
//Configure content security to allow bootstrap, unsplash etc.
app.use(helmet());

//102 and 44 errors to start!
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://code.jquery.com/",
  "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://kit.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://fonts.gstatic.com/",
  "https://maxcdn.bootstrapcdn.com/",
  "https://cdn.jsdelivr.net/",
];
const fontSrcUrls = [
  "https://ka-f.fontawesome.com/",
  "https://fonts.gstatic.com/",
  "https://maxcdn.bootstrapcdn.com/",
];
const connectSrc = ["https://ka-f.fontawesome.com/"];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...connectSrc],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: ["'self'", "blob:", "data:", "https://images.unsplash.com/"],
        fontSrc: [...fontSrcUrls],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(mongoSanitize());

// Below to parse the req.body. Telling express to parse the body
app.use(bodyParser.urlencoded({ extended: true }));

// I was stuck for a long time because I didn't have this. Stuck on the save button.
app.use(bodyParser.json());

// extra security measureMemory. httpOnly. Ensure cookies sent securely and aren't accessed by unintented parties or scripts
// Have expiry so someone doesn't just login once and stayed logged in
//We'll use secure:true when we deploy for https.

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

//error handling.
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

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
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/", authRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`SERVING ON PORT ${port}`);
});
