module.exports = {
    generateFileTables: (data) => {
        for(var key in data){
            var table = data[key];

            for(var i = 0; i < table.length; i++){
                var column = table[i];
                console.log(column.column_name);
            }
        }
    }
};