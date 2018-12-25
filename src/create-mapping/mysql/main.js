var { getConnectionData } = require('../../common/utilities');
var { getDbSchema } = require('../../common/dbconnection/mysql');
var fs = require('fs');
var handlebars = require('handlebars');

module.exports = {
    generateFileTables: (args) => {
        console.log('generateFileTables');
        var folder = 'DataModels';
        var conData = getConnectionData(args);
        var data = getDbSchema(conData).then((data) => {
            generateInsertFile(folder, data, conData);
        });
    }
};

function generateInsertFile(folder, data, conData) {
    console.log('generateInsertFile');
    if (!fs.existsSync(folder))
        fs.mkdirSync(folder);

    console.log('Data', data);
    for (var key in data) {
        var table = data[key];
        var columns = new Array();
        table.map((elm) => {
            if (!elm.column_key)
                columns.push(elm.column_name);
        });

        var tableName = table[0].table_name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

        //fs.readFile("test.txt", "utf8", function(err, data) {...});
        var main = fs.readFile('./src/create-mapping/mysql/resources/crud.txt', "utf8", (err, mainData) => {
            if (err) {
                console.log(`Could not read main resource file. Error: ${err}`);
                return;
            }

            // var test = handlebars.precompile(mainData, {noEscape: true});
            // var mainTemplate = handlebars.compile(test);

            var templateData = {
                server: conData.server,
                user: conData.user,
                password: conData.password,
                insert: generateInsert(columns, tableName),
                update: generateUpdate(table, tableName),
                selectAll: generateSelect(tableName),
                searchByColumn: generateSearchByColumn(tableName),
                deleteByColumn: generateDeleteByColumn(tableName)
            };

            for (var v in templateData) {
                console.log(v);
                console.log(templateData[v]);
                mainData = mainData.replace(`{{${v}}}`, templateData[v]);
            }

            console.log(mainData);

            fs.writeFile(`${folder}/${table[0].table_name}.js`, mainData, (err) => {
                if (err)
                    console.log(error);
            });
        });
    }
}

function generateInsert(columns, tableName) {
    return 'insertInto' + tableName + ': (values) => { \n' +
        '\t\tlet sql = \' INSERT INTO ' + tableName + ' (' + columns.join(',') + ') VALUES (\'+values.join(\',\')+\')\';\n' +
        '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t}';
}

function generateSearchByColumn(tableName) {
    var returnValue = '\selectByColumn' + tableName + ': (column, value) => {\n' +
        '\t\tlet sql = \'SELECT * FROM ' + tableName + ' WHERE \'+column+\' = \' + value;\n';
    returnValue += '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t}';

    return returnValue;
}

function generateSelect(tableName) {
    var returnValue = '\selectAll' + tableName + ': () => {\n' +
        '\t\tlet sql = \'SELECT * FROM ' + tableName + '\';\n';
    returnValue += '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t}';

    return returnValue;
}

function generateDeleteByColumn(tableName) {
    var returnValue = 'deleteByColumnValue' + tableName + ': (key, value) => {\n' +
        '\t\tlet sql = \'DELETE FROM ' + tableName + ' WHERE \'+key+\'=\'+value;\n';
    returnValue += '\t\tcon.connect(function(err) {\n' +
        '\t\t\tif(err) throw err;\n\n' +
        '\t\t\tconsole.log("Connected!");\n' +
        '\t\t\tcon.query(sql, function (err, result) {\n' +
        '\t\t\t\tif(err)throw err;\n' +
        '\t\t\t\tconsole.log("Result: " + result);\n' +
        '\t\t\t});\n' +
        '\t\t});\n' +
        '\t}';

    return returnValue;
}

function generateUpdate(columns, tableName) {
    var primaryKeyCol = null;
    var returnValue = 'update' + tableName + ': (data) => {\n' +
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
        '\t}';

    return returnValue;
}