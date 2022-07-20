const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Bodyfat = require('./models/bodyfat')

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

app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/bodyfat', async (req, res) =>{
    const bodyfat = await Bodyfat.find({})
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
});