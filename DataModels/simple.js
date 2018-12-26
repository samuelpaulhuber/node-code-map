var mysql = require("promise-mysql");
var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

module.exports = {
    insertIntoSimple: (values) => { 
		let sql = ' INSERT INTO Simple (Id,test) VALUES ('+values.join(',')+')';
		return con.query(sql);
	},
    updateSimple: (data) => {
		let sql = ' UPDATE Simple SET '+
        'test= '+"'"+data.test+"'"+
		'WHERE Id = ' + data.Id;
        return con.query(sql);
	},
    selectAllSimple: () => {
        let sql = 'SELECT * FROM Simple';
        return con.query(sql);
    },
    selectByColumnSimple: (data) => {
		let sql = 'SELECT * FROM Simple WHERE '+data.column+' = ' + data.value;

        return con.query(sql);
	},
    deleteByColumnValueSimple: (data) => {
		let sql = 'DELETE FROM Simple WHERE '+data.column+'='+data.value;
		return con.query(sql);
	}
}