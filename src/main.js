module.exports = () => {
    routeCommand: (argv) => {
        if (argv.create || argv.c) {
            cmd = 'c';
        }
    
        switch (cmd) {
            case 'c':
                {
                    if(argv.mongoose)
                        require('./create-mapping/mongoose/main')(argv);
                    else if(argv.mysql)
                        require('./create-mapping/mysql/main')(argv);
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