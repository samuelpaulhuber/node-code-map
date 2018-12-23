var fs = require('fs');
module.exports = {
    generateFileTables: (data, args) => {
        var folder = `./DataModels`;
        var conData = null;

        if (args.cf && fs.existsSync(args.cf)) {
            conData = fs.readFile(args.cf, (err, info) => {
                if (err) {
                    console.log(`Error reading file with name "${args.cf}": ${err}`);
                }

                conData = splitConnectionInfo(info);
            });
        } else if (args.cs) {
            conData = splitConnectionInfo(args.cs);
        } else if (args.t) {
            conData = {
                server: 'localhost',
                user: 'root',
                password: ''
            };
        } else {
            console.log('No connection string found.');
            return;
        }

        generateInsertFile(folder, data, conData);
    }
};

function generateInsertFile(folder, data, conData) {
    if (!fs.existsSync(folder))
        fs.mkdirSync(folder);

    for (var key in data) {
        var table = data[key];

        var file = "var myql = require('mysql');";
        file += "\n";
        file += "var con = mysql.createConnection({\n";
        file += `\thost: "${conData.server}",\n`;
        file += `\tusername: "${conData.user}",\n`;
        file += `\tpassword: "${conData.password}"\n`;
        file += "});\n\n";
        file += "modules.exports = {\n";

        var columns = new Array();
        table.map((elm) => {
            if(!elm.column_key)
                columns.push(elm.column_name);
        });

        var tableName = table[0].table_name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

        file += generateInsert(columns, tableName);
        file += generateUpdate(table, tableName);
        file += generateSelect(tableName);
        file += generateSearchByColumn(tableName);
        file += generateDeleteByColumn(tableName);
        file += '};';

        if (!fs.existsSync(folder))
            fs.mkdirSync(folder);

        fs.writeFile(`${folder}/${table[0].table_name}.js`, file, (err) => {
            if (err)
                console.log(error);
        });
    }
}

function splitConnectionInfo(conString) {
    if (!conString)
        return;

    var connectionDetails = {
        server: null,
        username: null,
        password: null
    };

    var conStrArr = conString.split(';');
    conStrArr.forEach(element => {
        var elmArr = element.split('=');

        if (elmArr.length !== 2)
            return;

        switch (elmArr[0]) {
            case "server":
                connectionDetails.server = elmArr[1];
                break;
            case "username":
                connectionDetails.username = elmArr[1];
                break;
            case "password":
                connectionDetails.password = elmArr[1];
                break;
        }
    });
}

function generateInsert(columns, tableName) {
    console.log('turkey', columns)
    return '\tinsertInto' + tableName + ': (values) => { \n' +
        '\t\tlet sql = \' INSERT INTO ' + tableName + ' (' + columns.join(',') + ') VALUES (\'+values.join(\',\')+\')\';\n' +
        '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t},\n';
}

function generateSearchByColumn(tableName) {
    var returnValue = '\t\selectByColumn' + tableName + ': (column, value) => {\n' +
        '\t\tlet sql = \'SELECT * FROM ' + tableName + ' WHERE \'+column+\' = \' + value;\n';
    returnValue += '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t},\n';

    return returnValue;
}

function generateSelect(tableName) {
    var returnValue = '\t\selectAll' + tableName + ': () => {\n' +
        '\t\tlet sql = \'SELECT * FROM ' + tableName + '\';\n';
    returnValue += '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t},\n';

    return returnValue;
}

function generateDeleteByColumn(tableName) {
    var returnValue = '\tdeleteByColumnValue' + tableName + ': (key, value) => {\n' +
        '\t\tlet sql = \'DELETE FROM ' + tableName + ' WHERE \'+key+\'=\'+value;\n';
    returnValue += '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t},\n';

    return returnValue;
}

function generateUpdate(columns, tableName) {
    var primaryKeyCol = null;
    var returnValue = '\tupdate' + tableName + ': (data) => {\n' +
        '\t\tlet sql = \' UPDATE ' + tableName + ' SET \'+\n';


    for (var i = 0; i < columns.length; i++) {
        var column = columns[i];
        var pair = `\t\t\'${column.column_name}= \'`;

        if (column.column_key === 'PRI') {
            primaryKeyCol = column;
            continue;
        }


        if (column.numeric_scale === null)
            pair += `+"\'"+data.${column.column_name}+"\'"`;
        else
            pair += `+data.${column.column_name}`;

        if (i !== columns.length - 1)
            pair += '+\',\'+';
        else
            pair += '+';

        returnValue += pair + '\n';
    }

    returnValue += `\t\t\' WHERE ${primaryKeyCol.column_name} = `;
    if (primaryKeyCol.numeric_scale === null)
        returnValue += '\'';

    returnValue += '\' + ' + `data.${primaryKeyCol.column_name}`;

    if (primaryKeyCol.numeric_scale === null)
        returnValue += '\'';

    returnValue += ';\n';

    returnValue += '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t},\n';

    return returnValue;
}