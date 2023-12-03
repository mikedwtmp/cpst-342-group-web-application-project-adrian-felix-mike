var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./med_record_db.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
	  console.error(err.message)
	  throw err
	}else{
		console.log('Connected to the SQLite database.') 
	}
});

let lookUpUser = (userName, res) => {
    var lookUpUser = "SELECT * from userInfo WHERE userName = ?";
    db.each(lookUpUser, [userName], (err, row) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        if(!row) {
            res.render('/usernotfound');
        }else{
            console.log(row)
            res.render('loginSuccess.hbs', row);
        }

    })

}

let getAllAndRender = (userID, res) => {
    var medTableName = "medTableID" + userID;
    var query = "SELECT * from " + medTableName;
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        
        var params = {userID: userID, rows: rows};
        console.log(params)
        res.render('dashboard.hbs', params);
    
    })

}

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

let addNewMedication = (medInfoObject, res) => {
    console.log(medInfoObject);
    //var userID = number(medInfoObject.userID)
    var addMedQuery = "INSERT INTO medTableID" + medInfoObject.userID + " (medName, medDose, doseUnit, frequency, comment, userID) VALUES (?, ?, ?, ?, ?, ?)";
    var params = [medInfoObject.medName, medInfoObject.medDose, medInfoObject.doseUnit, medInfoObject.frequency, medInfoObject.comment, medInfoObject.userID];
    console.log(params);
    db.run(addMedQuery, params, (err) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        console.log(res)
        getAllAndRender(medInfoObject.userID, res);
        
        
    })
    

}

let lookUpMedToUpdate = (medID, userID, res) => {
    
    queryForUpdate = "SELECT * from medTableID" + userID + " WHERE medID = ?";
    db.get(queryForUpdate, medID, (err, row) => {
        if (err) {
            console.error(err.message)
            throw err
        }
        console.log(row);
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

module.exports = {lookUpUser, getAllAndRender, deleteMed, addNewMedication, lookUpMedToUpdate, updateAndRender};

// var addUser = "INSERT INTO userInfo (userName, fName, lName, age, streetAddress, ZIP) VALUES (?, ?, ?, ?, ?, ?)";
// var params = ['lWolf', 'Lu', 'Wolf', 21, '1032 W Sheridan Rd', 60660];
// db.run(addUser, params, (err) => {
//     if (err) {
//         return console.log(err);
//     }
//     console.log(`entry added`);
// })