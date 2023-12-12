var sqlite3 = require('sqlite3').verbose();
const getLastWeekEndDate = require('./getLastWeekEndDate.js');

let db = new sqlite3.Database('./med_record_db.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.') 
    }
});

// Check user account  
let lookUpUser = (userName, res) => {
    var lookUpUser = "SELECT * from userInfo WHERE userName = ?";
    db.get(lookUpUser, [userName], (err, row) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        if(!row) {
            res.render('usernotfound');
        }else{
            console.log(row)
            res.render('loginSuccess.hbs', row);
        }

    })

}



// Display Medication Details
let getAllAndRender = (userID, res) => {
    var medTableName = "medTableID" + userID;
    var query = "SELECT * from " + medTableName;
    db.all(query, (err, rows_1) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        
        var params = {userID: userID, rows: rows_1};
        var getUserInfo = "SELECT * from userInfo WHERE userID = ?";
        db.get(getUserInfo, userID, (err, row) => {
            console.log(row);
            res.render('dashboard.hbs', Object.assign(params, row))

        })
        
    
    })

}
// Delete Medication Details
let deleteMed = (medID, userID, res) => {
    var deleteQuery = "DELETE from medTableID" + userID + " WHERE medID = ?";
    db.run(deleteQuery, [medID], (err) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        getAllAndRender(userID, res);
    })
}


// Create Medication Details
let addNewMedication = (medInfoObject, res) => {
    console.log(medInfoObject);
    //var userID = number(medInfoObject.userID)
    var addMedQuery = "INSERT INTO medTableID" + medInfoObject.userID + " (medName, medDose, doseUnit, frequency, comment, userID) VALUES (?, ?, ?, ?, ?, ?)";
    var params = [medInfoObject.medName, medInfoObject.medDose, medInfoObject.doseUnit, medInfoObject.frequency, medInfoObject.comment, medInfoObject.userID];
    db.run(addMedQuery, params, (err) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        getAllAndRender(medInfoObject.userID, res);
        
        
    })
    

}

//Update Medication Details
let lookUpMedToUpdate = (medID, userID, res) => {
    
    queryForUpdate = "SELECT * from medTableID" + userID + " WHERE medID = ?";
    db.get(queryForUpdate, medID, (err, row) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        res.render('updateForm.hbs', row);

    })
}

let updateAndRender = (updateParams, res) => {
    var updateQuery = "UPDATE medTableID" + updateParams.userID + " SET medName = ?, medDose = ?, doseUnit = ?, frequency = ?, comment = ? WHERE medID = ?";
    params = [updateParams.medName, updateParams.medDose, updateParams.doseUnit, updateParams.frequency, updateParams.comment, updateParams.medID];
    db.run(updateQuery, params, (err) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        getAllAndRender(updateParams.userID, res);
    })
}

// Get COVID data through API
let getCovidData = (userID, res) => {
    today = getLastWeekEndDate.getLastWeekEndDate();
    
    dbQuery = "SELECT * from userInfo WHERE userID = ?";
    db.get(dbQuery, userID, (err, row) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        var url = "https://data.cityofchicago.org/resource/yhhz-zm2v.json?week_end=" + today.toISOString()
        url = url.substring(0, url.length - 1);
        url = url + "&zip_code=" + row.ZIP;
        console.log(url)
        fetch(url)
        .then(data => data.json())
        .then(data => {
            console.log(data);
            res.render('covidAlert.hbs', {userID:userID, data:data[0]})})

    })
   
}



let createNewAccount = (info, res) => {
    console.log(info)
    var addUser = "INSERT INTO userInfo (userName, fName, lName, Age, streetAddress, ZIP) values (?, ?, ?, ?, ?, ?)";
    var params = [info.userName, info.fName, info.lName, info.Age, info.streetAddress, info.ZIP];
    db.run(addUser, params, (err) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        var getNewUser = "SELECT userID from userInfo WHERE userName = ?"
        db.get(getNewUser, info.userName, (err, ID) => {
            if (err) {
                console.error(err.message)
                throw err
            }
            console.log(ID);
            createNewUserTableAndGetDashboard(ID.userID, res);
        })

    })
}

let createNewUserTableAndGetDashboard = (userID, res) => {
    var createNewMedTable = "CREATE TABLE medTableID" + userID + " (medID INTEGER, medName TEXT, medDose INTEGER, doseUnit TEXT, frequency TEXT, comment TEXT, userID INTEGER, PRIMARY KEY('medID'))";
    db.run(createNewMedTable, (err) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        getAllAndRender(userID, res);

    })
}

module.exports = {lookUpUser, getAllAndRender, deleteMed, addNewMedication, lookUpMedToUpdate, updateAndRender, getCovidData, createNewAccount};

// var addUser = "INSERT INTO userInfo (userName, fName, lName, age, streetAddress, ZIP) VALUES (?, ?, ?, ?, ?, ?)";
// var params = ['lWolf', 'Lu', 'Wolf', 21, '1032 W Sheridan Rd', 60660];
// db.run(addUser, params, (err) => {
//     if (err) {
//         return console.log(err);
//     }
//     console.log(`entry added`);
// })

