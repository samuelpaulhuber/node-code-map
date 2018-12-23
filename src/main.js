module.exports = () => {
    RouteCommand: (argv) => {
        if (argv.create || argv.c) {
            cmd = 'c';
        }
    
        switch (cmd) {
            case 'c':
                {
                    require('./cmds/create_mapping')(argv);
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