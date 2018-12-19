var {getDbSchema} = require('../src/common/dbconnection/mysql');
var {generateFileTables} = require('../src/create-mapping/main');

module.exports = (args) => {
  var schema = getDbSchema('test');
  // schema.then((data) => {
  //   console.log('schema', data);
  //   generateFileTables(data, args);
  // }); 
}