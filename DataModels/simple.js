var myql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	username: "root",
	password: ""
});

modules.exports = {
	insertIntosimple: (values) => { 
		let sql = ' INSERT INTO simple (test,tes2) VALUES ('+values.join(',')+')';
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
		'test= '+"'"+data.test+"'"+','+
		'tes2= '+data.tes2+
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
	selectAllsimple: () => {
		let sql = 'SELECT * FROM simple';
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	},
	selectByColumnsimple: (column, value) => {
		let sql = 'SELECT * FROM simple WHERE '+column+' = ' + value;
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	},
	deleteByColumnValuesimple: (key, value) => {
		let sql = 'DELETE FROM simple WHERE '+key+'='+value;
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