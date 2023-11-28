const express = require('express')
const dbOperations = require('./database.js');
const app = express()
const port = 3000

app.use(express.static('assets'))
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home.hbs');
})

app.listen(port)