var {generateFileTables} = require('./create-mapping/mysql/main')
module.exports = {
    routeCommand: (argv) => {
        var cmd = '';
        if (argv.create || argv.c) {
            cmd = 'c';
        }
    
        switch (cmd) {
            case 'c':
                {
                    if(argv.mongoose)
                        require('./create-mapping/mongoose/main')(argv);
                    else if(argv.mysql)
                        console.log('this is mysql');
                        generateFileTables(argv);
                    break;
                }
            default:
                {
                    console.log(`"${cmd}" not recognized. Use --help to list valid commands.`);
                    break;
                }
        }
    }
}