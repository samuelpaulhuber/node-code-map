var myql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	username: "undefined",
	password: ""
});

modules.exports = {
	insertIntosimple: (values) => { 
		let sql = ' INSERT INTO simple (id) VALUES ('+values.join(',')+')';
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	},
	updatesimple: (data) => {
		let sql = ' UPDATE simple SET '+
		'WHERE id = ' + data.id;
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	},
};