var {getDbSchema} = require('../src/common/dbconnection/mysql');

module.exports = (args) => {
  var schema = getDbSchema('test');
  schema.then((data) => {
    console.log('schema', data);
    for(var key in data){
      console.log(key);
    }
  }); 
}