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

        fs.readFile('./src/create-mapping/mysql/resources/crud.hbs', "utf8", (err, mainData) => {
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

                const template = handlebars.compile(mainData.toString(), { strict: true });
                const result = template(templateData);

                fs.writeFile(`${folder}/${table[0].table_name}.js`, result, (err) => {
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
        fs.readFile('src/create-mapping/mysql/resources/insert.hbs', (err, insertFcn) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            const data = {
                table: tableName,
                columns: columns.join(',')
            };
            const template = handlebars.compile(insertFcn.toString(), { strict: true });
            const result = template(data);

            resolve(result);
        });
    });
}

function generateSearchByColumn(tableName) {
    return new Promise((resolve, reject) => {
        fs.readFile('src/create-mapping/mysql/resources/selectByColumn.hbs', (err, selectByFcn) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            const data = {
                table: tableName
            };
            const template = handlebars.compile(selectByFcn.toString(), { strict: true });
            const result = template(data);

            resolve(result);
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
        fs.readFile('src/create-mapping/mysql/resources/deleteByColumn.hbs', (err, deleteFcn) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            const data = {
                table: tableName
            };
            const template = handlebars.compile(deleteFcn.toString(), { strict: true });
            const result = template(data);

            resolve(result);
        });
    });
}

function generateUpdate(columns, tableName) {
    return new Promise((resolve, reject) => {
        fs.readFile('src/create-mapping/mysql/resources/update.hbs', (err, updateFcn) => {
            var primaryKeyCol = null;
            var setColumns = '';
            if (err) {
                console.log(err);
                reject(err);
            }

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

            const data = {
                table: tableName,
                columns: setColumns,
                where: where
            };
            const template = handlebars.compile(updateFcn.toString(), { strict: true });
            const result = template(data);

            resolve(result);
        });
    });
}