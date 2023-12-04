const express = require('express');
const dbOperations = require('./database.js');
const getLastWeekEndDate = require('./getLastWeekEndDate.js');
const app = express();
const port = 3000;

app.use(express.static('assets'))
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('home.hbs');
})

// Route to authenticate User
app.post('/authenticate', function(req, res) {
    console.log(req.body)
    console.log(`authenticating ${req.body.userName}...`)
    dbOperations.lookUpUser(req.body.userName, res);
})

// Route to authenticate User
app.post('/dashboard', (req, res) => {
     //continue here
     let userID = req.body.userID;
     dbOperations.getAllAndRender(userID, res);
})

// Route to create New Medical Detail
app.post('/addNewMed', (req, res) => {
    var userID = req.body.userID;
    res.render('newMedForm.hbs', {userID: userID});
})

// Route to create New Medical Detail
app.post('/createMedEntry', (req, res) => {
    dbOperations.addNewMedication(req.body, res);
})

// Route to delete Medical Detail
app.post('/deleteMed', (req, res) => {
    console.log(req.body);
    dbOperations.deleteMed(req.body.medID, req.body.userID, res);
})

// Route to update Medical Detail
app.post('/updateMed', (req, res) => {
    console.log(req.body);
    dbOperations.lookUpMedToUpdate(req.body.medID, req.body.userID, res);
})

app.post('/updateMedEntry', (req, res) => {
    console.log(req.body);
    dbOperations.updateAndRender(req.body, res);
})

// Route to show Covid alers
app.post('/covidAlert', (req, res) => {
    console.log("covid app" + req.body.userID);
    dbOperations.getCovidData(req.body.userID, res)
})


app.post('/usernotfound', (req, res) => {
    res.render('usernotfound.hbs');
})

app.listen(port, () => console.log(`Example app listening port ${port}!`))
