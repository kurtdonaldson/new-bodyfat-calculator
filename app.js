const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bodyfat = require('./models/bodyfat');
const bodyParser = require("body-parser");

mongoose.connect('mongodb://localhost:27017/bodyfat-calculator');

//making db variable saves you from saying mongoose.connection.on
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// Below to parse the req.body. Telling express to parse the body
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Below so I can use css stylesheet in ejs file. 
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// app.get is fine. No changes
app.get('/', async (req, res) => {
    const clients = await Bodyfat.find({});
    res.render('home', { clients })
})

// creating new client. this is working
app.post('/', async(req, res) => {
    const client = new Bodyfat(req.body);
    await client.save();
    res.redirect("/");
})

// delete user from DB
app.delete("/clients", async(req, res) => {
    const clients = await Bodyfat.deleteOne(req.body)
        .then(() => {
          res.json(`Deleted user`);
        })
        .catch(() => {
          res.redirect("/");
        });
    });

// add new test to client and save to DB
app.put("/clients", async(req, res) => {
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
    });

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
});