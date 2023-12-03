const express = require('express');
const dbOperations = require('./database.js');
const getLastWeekEndDate = require('./getLastWeekEndDate.js');
const app = express();
const port = 3000;

app.use(express.static('assets'))
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home.hbs');
})

app.post('/authenticate', function(req, res) {
    console.log(req.body)
    console.log(`authenticating ${req.body.userName}...`)
    dbOperations.lookUpUser(req.body.userName, res);
})

app.post('/dashboard', (req, res) => {
     //continue here
     let userID = req.body.userID;
     dbOperations.getAllAndRender(userID, res);
})

app.post('/addNewMed', (req, res) => {
    var userID = req.body.userID;
    res.render('newMedForm.hbs', {userID: userID});
})

app.post('/createMedEntry', (req, res) => {
    dbOperations.addNewMedication(req.body, res);
})

app.post('/deleteMed', (req, res) => {
    console.log(req.body);
    dbOperations.deleteMed(req.body.medID, req.body.userID, res);
})

app.post('/updateMed', (req, res) => {
    console.log(req.body);
    dbOperations.lookUpMedToUpdate(req.body.medID, req.body.userID, res);
})

app.post('/updateMedEntry', (req, res) => {
    console.log(req.body);
    dbOperations.updateAndRender(req.body, res);
})

app.post('/covidAlert', (req, res) => {
    console.log("covid app" + req.body.userID);
    dbOperations.getCovidData(req.body.userID, res)
})

app.post('/usernotfound', (req, res) => {
    res.render('usernotfound.hbs');
})

app.listen(port)