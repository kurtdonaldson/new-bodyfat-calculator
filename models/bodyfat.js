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

//Potential Schema
// const BodyfatSchema = new Schema({
//     client: {
//     name: String,
//     test: [
//         {
//         date: String,
//         bodyfat: String,
//         weight: String,
//         leanMass: String,
//         classification: String
//        }
//        ]
//     }
// });

//When looking on mongo for stored data. Will need to use db.bodyfats.find()
//bodyfat will be pluralised to bodyfats
module.exports = mongoose.model('Bodyfat', BodyfatSchema);