
            var mysql = require('mysql');

            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                database : 'test',
                password: ""
              });

            module.exports = {

            insertIntosimple: (values) => { 
 let sql = ' INSERT INTO simple (id) VALUES ('+values.join(',')+')';

           con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Result: " + result);
            });
          });
            },

};