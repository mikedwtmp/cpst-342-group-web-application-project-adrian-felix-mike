var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./med_record_db.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
	  console.error(err.message)
	  throw err
	}else{
		console.log('Connected to the SQLite database.') 
	}
});


// var addUser = "INSERT INTO userInfo (userName, fName, lName, age, streetAddress, ZIP) VALUES (?, ?, ?, ?, ?, ?)";
// var params = ['lWolf', 'Lu', 'Wolf', 21, '1032 W Sheridan Rd', 60660];
// db.run(addUser, params, (err) => {
//     if (err) {
//         return console.log(err);
//     }
//     console.log(`entry added`);
// })