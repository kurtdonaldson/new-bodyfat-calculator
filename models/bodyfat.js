const mongoose = require('mongoose');
// creating the variable Schema makes a shortcut
const Schema = mongoose.Schema;

const BodyfatSchema = new Schema({
    name: String,
    date: String,
    leanMass: String,
    weight: String,
    classification: String
});

module.exports = mongoose.model('Bodyfat', BodyfatSchema);