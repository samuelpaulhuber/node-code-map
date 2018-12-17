var fs = require('fs');
module.exports = {
    generateFileTables: (data) => {
        var folder = `./DataModels`;

        if(!fs.existsSync(folder))
                fs.mkdirSync(folder);

        for(var key in data){
            var table = data[key];
            
            var tableFile = `
            var mysql = require('mysql');

            var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: ""
              });

            modules.exports = {\n
            `;
            
            var columns = table.map((elm) => {return elm.column_name;});

            tableFile += generateInsert(table, columns);
            
            tableFile += '\n};';
            
            if(!fs.existsSync(folder))
                fs.mkdirSync(folder);

            fs.writeFile(`${folder}/${table[0].table_name}.js`, tableFile, (err) => {
                if(err)
                    console.log(error);
            });
        }
    }
};

function generateInsert(table, columns) {
    return 'insertInto' + table[0].table_name +': (values) => { \n' +
           ' let sql = \' INSERT INTO ' + table[0].table_name + ' (' + columns.join(',') + ') VALUES (\'+values.join(\',\')+\')\';\n' +
           `
           con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log("Result: " + result);
            });
          });
           `+
            ' },\n';
    
}


// RowDataPacket {
//     table_name: 'simple',
//     column_name: 'id',
//     column_default: null,
//     is_nullable: 'NO',
//     data_type: 'int',
//     character_maximum_length: null }