var self = module.exports = {
    getConnectionData: (args) => {
        var conData = {};

        if (args.cf && fs.existsSync(args.cf)) {
            conData = fs.readFile(args.cf, (err, info) => {
                if (err) {
                    console.log(`Error reading file with name "${args.cf}": ${err}`);
                }
                    
                conData = self.splitConnectionInfo(info);
            });
        } else if (args.cs) {
            console.log(args.cs);
            conData = self.splitConnectionInfo(args.cs);
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
            user: null,
            password: null
        };
    
        var conStrArr = conString.split(';');
        for(var i = 0; i < conStrArr.length; i++) {
            var elmArr = conStrArr[i].split('=');
    
            if (elmArr.length !== 2)
                return;
    
            switch (elmArr[0]) {
                case "server":
                    connectionDetails.server = elmArr[1];
                    break;
                case "user":
                    connectionDetails.user = elmArr[1];
                    break;
                case "password":
                    connectionDetails.password = elmArr[1];
                    break;
                case "database":
                    connectionDetails.database = elmArr[1];
                    break;
            }
        }

        return connectionDetails;
    }
}