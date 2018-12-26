const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const Simple = require('../DataModels/simple');

const port = 3000

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/Simple/selectAll', (req, res) => { 
    Simple.selectAllSimple().then((data) => {
        res.send(data);   
    });    
});

app.post('/Simple/updateSimple', (req, res) => { 
    Simple.updateSimple(req.body).then((data) => {
        res.send(data);
    });
});

app.post('/Simple/insertIntoSimple', (req, res) => { 
    Simple.insertIntoSimple(req.body).then((data) => {
        res.send(data);   
    });
});

app.post('/Simple/selectByColumnSimple', (req, res) => { 
    Simple.selectByColumnSimple(req.body).then((data) => {
        res.send(data);
    });    
});

app.post('/Simple/deleteByColumnValueSimple', (req, res) => { 
    Simple.deleteByColumnValueSimple(req.body).then((data) => {
        res.send();
    });
});



app.listen(port, () => console.log(`App is listening on port ${port}!`));