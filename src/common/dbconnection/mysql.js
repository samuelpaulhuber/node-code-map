var mysql = require('mysql');

module.exports = {
    getConnection: (server, username, password) => {
        var con = mysql.createConnection({
            host: server,
            user: username,
            password: password
        });
        return con;
    },
    getDbSchema: (dbName) => {
        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root'
        });

        var sql = `SELECT table_name, column_name, column_default, is_nullable, data_type, character_maximum_length, column_key, numeric_scale
        FROM information_schema.columns
        where table_schema = '${dbName}'
        group by table_name`;

        return new Promise((resolve, reject) => {
            con.query(sql, function (err, result) {
                if (err) reject(err);
                console.log("Result: " + JSON.stringify(result, null, 2));

                var resultArr = new Array();

                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        var element = result[key];
                        if (!resultArr[element.table_name]) {
                            resultArr[element.table_name] = new Array();
                        }

                        resultArr[element.table_name].push(element);
                    }
                }
                resolve(resultArr);
            });
        });
    }
}