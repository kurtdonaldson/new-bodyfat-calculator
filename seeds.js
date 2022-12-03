//nodemon seeds.file will delete all existing records and replace with seedClients

const mongoose = require('mongoose');
const Bodyfat = require('./models/bodyfat');

mongoose.connect('mongodb://localhost:27017/bodyfat-calculator');

//making db variable saves you from saying mongoose.connection.on
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//To keep things tidy. I have my name set as author for seeds files. These clients will now only show when my name is logged in. 
const seedClients = [
    {     
        name: 'John Doe',
        author: "62ea3108ac5eba97757be291",
        test: [
           {
             date: "20/07/2022",
             bodyfat: "15%",
             weight: "100kg",
             leanMass: "80kg",
             classification: "Athlete",
           }
        ]
    },
    {     
        name: 'Jane Doe',
        author: "62ea3108ac5eba97757be291",
        test: [
           {
             date: "10/07/2022",
             bodyfat: "10%",
             weight: "60kg",
             leanMass: "50kg",
             classification: "Fitness",
           }
        ]
    },
];

const seedDB = async () => {
    //deleteMany will delete all existing records and replace them with these. 
    await Bodyfat.deleteMany({});
    await Bodyfat.insertMany(seedClients);
}

seedDB().then(() => {
    mongoose.connection.close();
});