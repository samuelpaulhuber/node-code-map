var myql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    username: "root",
    password: ""
});

modules.exports = {
    insertIntoSimple: (values) => { 
		let sql = ' INSERT INTO Simple (test) VALUES ('+values.join(',')+')';
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	},
    updateSimple: (data) => {
		let sql = ' UPDATE Simple SET '+
		'test= '+"'"+data.test+"'"+
		' WHERE Id = ' + data.Id;
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	},
    selectAllSimple: () => {
		let sql = 'SELECT * FROM Simple';
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	},
    selectByColumnSimple: (column, value) => {
		let sql = 'SELECT * FROM Simple WHERE '+column+' = ' + value;
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	},
    deleteByColumnValueSimple: (key, value) => {
		let sql = 'DELETE FROM Simple WHERE '+key+'='+value;
		con.connect(function(err) {
			if(err) throw err;

			console.log("Connected!");
			con.query(sql, function (err, result) {
				if(err)throw err;
				console.log("Result: " + result);
			});
		});
	}
}