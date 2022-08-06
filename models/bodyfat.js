const mongoose = require('mongoose');
// creating the variable Schema makes a shortcut
const Schema = mongoose.Schema;
//author - this is where we save the users id to the client being created. 
const BodyfatSchema = new Schema({
    name: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    test: [
        {
            date: String,
            bodyfat: String,
            weight: String,
            leanMass: String,
            classification: String,
        }
    ]
});



//When looking on mongo for stored data. Will need to use db.bodyfats.find()
//bodyfat will be pluralised to bodyfats
module.exports = mongoose.model('Bodyfat', BodyfatSchema);