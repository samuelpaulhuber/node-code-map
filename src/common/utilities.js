module.exports = {
    getConnectionData: (args) => {
        var conData = {};

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
                password: '',
                database: 'test'
            };
        } else {
            console.log('No connection string found.');
            return {};
        }

        return conData;
    },
    splitConnectionInfo: (conString) => {
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
                case "database":
                    connectionDetails.database = elmArr[1];
                    break;
            }
        });
    }
}