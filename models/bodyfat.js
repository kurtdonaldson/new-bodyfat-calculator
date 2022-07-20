const mongoose = require('mongoose');
// creating the variable Schema makes a shortcut
const Schema = mongoose.Schema;

const BodyfatSchema = new Schema({
    name: String,
    test: [
        {
            date: String,
            bodyfat: String,
            weight: String,
            leanMass: String,
            classification: String
        }
    ]
});

//If it gets too difficult. Try this schema to start
// const BodyfatSchema = new Schema({
//     name: String,
//     date: String,
//     bodyfat: String,
//     weight: String,
//     leanMass: String
// });

//When looking on mongo for stored data. Will need to use db.bodyfats.find()
//bodyfat will be pluralised to bodyfats
module.exports = mongoose.model('Bodyfat', BodyfatSchema);