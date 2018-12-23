const {RouteCommand} = require('./src/main')
const argv = require('yargs') // eslint-disable-line
    .command('create', 'generate data access files', {
        alias: 'c',
        default: false
    })
    .option('connection_string', {
        alias: 'cs',
        default: false
    })
    .option('connection_file', {
        alias: 'cf',
        default: false
    })
    .argv;

module.exports = () => {
    console.log(argv);
    RouteCommand(argv);    
}