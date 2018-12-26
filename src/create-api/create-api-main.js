var fs = require('fs');

module.exports = {
    generateApi: (tables, port) => {
        fs.readFile('./src/create-api/resources/outline.txt', "utf8", (err, mainData) => {
            var apiFile = mainData.toString();

            const folder = 'Api';

            fs.readFile('./src/create-api/resources/routes.txt', (err, routeData) => {
                if(err) {
                    console.log(err);
                    return;
                }

                if (!port)
                    port = 3000;

                var routes = '';
                var requires = '';
                for(var i = 0; i < tables.length; i++) {
                    var tableName = tables[i];
                    var temp = routeData.toString().replace(/{{table}}/g, tableName);
                    routes += temp;
                    requires += `const ${tableName} = require('../DataModels/${tableName}}');\n`;
                }

                apiFile = apiFile.replace(/{{port}}/, port).replace(/{{routes}}/, routes).replace(/{{requires}}/, requires);

                if (!fs.existsSync(folder))
                    fs.mkdirSync(folder);

                fs.writeFile(`${folder}/api.js`, apiFile, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                });
            });


        });
    }
}
