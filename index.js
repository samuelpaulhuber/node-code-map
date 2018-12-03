const minimist = require('minimist');

module.exports = () => {
        const args = minimist(process.argv.slice(2));
        console.log(args);

        let cmd = args._[0] || 'help';


        if(args.version || args.v){
            cmd = 'version';
        }

        if(args.help || args.h){
            cmd = 'help';
        }

        switch(cmd){
            case 'today': {
                require('./cmds/today')(args);
                break;
            }
            case 'version': {
                require('./cmds/version')(args);
                break;
            }
            case 'help': {
                require('./cmds/help')(args);
            }
            default:{
                console.log(`${cmd} not recognized`);
                break;
            }
        }
  }