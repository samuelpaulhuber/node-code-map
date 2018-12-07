const minimist = require('minimist');

module.exports = () => {
    const args = minimist(process.argv.slice(2));
    console.log(args);
    var cmd = args._[0] || 'help';


    if (args.create || args.c) {
        cmd = 'c';
    }

    switch (cmd) {
        case 'c':
            {
                require('./cmds/create_mapping')(args);
                break;
            }
        default:
            {
                console.log(`${cmd} not recognized`);
                break;
            }
    }
}