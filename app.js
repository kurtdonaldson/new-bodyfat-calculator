const express = require('express');
const app = express();

app.get('/', (req, res) =>{
    res.send('APP IS WORKING. THAT IS A BINGO!')
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
});