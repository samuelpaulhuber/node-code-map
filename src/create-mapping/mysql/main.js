var { getConnectionData } = require('../../common/utilities');
var { getDbSchema } = require('../../common/dbconnection/mysql');
var fs = require('fs');
var api = require('../../create-api/create-api-main');
const handlebars = require('handlebars');

module.exports = {
    generateFileTables: (args) => {
        var folder = 'DataModels';
        var conData = getConnectionData(args);
        getDbSchema(conData).then((data) => {
            generateTable(folder, data, conData);

            if (args.api) {
                generateApi(data);
            }
        });
    }
};

function generateApi(data) {
    var tables = new Array();
    for (var key in data) {
        var table = data[key];
        tables.push(table[0].table_name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }));
    }

    api.generateApi(tables);
}

function generateTable(folder, data, conData) {
    if (!fs.existsSync(folder))
        fs.mkdirSync(folder);

    var tables = new Array();

    for (var key in data) {
        var table = data[key];
        var columns = new Array();
        table.map((elm) => {
            columns.push(elm.column_name);
        });

        var tableName = table[0].table_name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

        fs.readFile('./src/create-mapping/mysql/resources/crud.txt', "utf8", (err, mainData) => {
            if (err) {
                console.log(`Could not read main resource file. Error: ${err}`);
                return;
            }

            var templateData = {
                server: conData.server,
                user: conData.user,
                password: conData.password,
                database: conData.database
            };
            var prom = new Array();

            prom.push(generateDeleteByColumn(tableName).then((statement) => {
                templateData.deleteByColumn = statement;
            }));

            prom.push(generateSearchByColumn(tableName).then((statement) => {
                templateData.searchByColumn = statement;
            }));

            prom.push(generateSelect(tableName).then((statement) => {
                templateData.selectAll = statement;
            }));

            prom.push(generateInsert(columns, tableName).then((statement) => {
                templateData.insert = statement;
            }));

            prom.push(generateUpdate(table, tableName).then(statement => {
                templateData.update = statement;
            }));

            Promise.all(prom).then(() => {
                for (var v in templateData) {
                    mainData = mainData.replace(`{{${v}}}`, templateData[v]);
                }

                fs.writeFile(`${folder}/${table[0].table_name}.js`, mainData, (err) => {
                    if (err) {
                        console.log(error);
                        return;
                    }
                });
            });
        });
    }
}

function generateInsert(columns, tableName) {
    return new Promise((resolve, reject) => {
        fs.readFile('src/create-mapping/mysql/resources/insert.txt', (err, insertFcn) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            console.log('INSERT', insertFcn.toString())

            resolve(insertFcn.toString().replace('{{table}}', tableName).replace('{{columns}}', columns.join(',')));
        });
    });
}

function generateSearchByColumn(tableName) {
    return new Promise((resolve, reject) => {
        fs.readFile('src/create-mapping/mysql/resources/selectByColumn.txt', (err, selectByFcn) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            console.log('SEARCH BY COLUMN', selectByFcn.toString())

            resolve(selectByFcn.toString().replace('{{table}}', tableName));
        });
    });
}

function generateSelect(tableName) {
    return new Promise((resolve, reject) => {
        fs.readFile('src/create-mapping/mysql/resources/selectAll.hbs', 'utf8', (err, selectAllFcn) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            const data = {
                table: tableName
            };
            const template = handlebars.compile(selectAllFcn.toString(), { strict: true });
            const result = template(data);

            resolve(result);
        });
    });
}

function generateDeleteByColumn(tableName) {
    return new Promise((resolve, reject) => {
        fs.readFile('src/create-mapping/mysql/resources/deleteByColumn.txt', (err, deleteFcn) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            console.log('DELETE', deleteFcn.toString())

            resolve(deleteFcn.toString().replace('{{table}}', tableName));
        });
    });
}

function generateUpdate(columns, tableName) {
    return new Promise((resolve, reject) => {
        fs.readFile('src/create-mapping/mysql/resources/update.txt', (err, updateFcn) => {
            var primaryKeyCol = null;
            var setColumns = '';
            if (err) {
                console.log(err);
                reject(err);
            }

            console.log('UDPATE', updateFcn.toString())
            console.log('Update Columns:', columns);
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                var pair = `'${column.column_name}= \'`;

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

                setColumns += pair + '\n';
            }


            var where = `'WHERE ${primaryKeyCol.column_name} = ' `;

            if (primaryKeyCol.numeric_scale === null)
                where += '\'' + `data.${primaryKeyCol.column_name} \'`
            else
                where += `+ data.${primaryKeyCol.column_name}`

            resolve(updateFcn.toString().replace('{{table}}', tableName).replace('{{columns}}', setColumns)
                .replace('{{where}}', where));
        });
    });
}