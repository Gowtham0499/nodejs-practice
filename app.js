var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var consolidate = require('consolidate');
var dust = require('dustjs-helpers');
const { Client } = require('pg')

var app = express();

//Database Connection URI
const connectionString = 'postgres://Gowtham:root@localhost:5432/todosdb';

//Assign Dust Engine to .dust files 
app.engine('dust', consolidate.dust);

//Set Default Extension as '.dust'
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Set public Folder
app.use(express.static(path.join(__dirname, 'public')));

//BodyParser Middleware
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Routing
app.get('/', (request, response) => {

    //getConnection to database to get data
    const client = new Client({
        connectionString: connectionString
    });
    client.connect();
    client.query('SELECT * FROM todo', (err, result) => {
        if (err) {
            return console.error('error running query', err);
        }
        response.render('index', { todos: result.rows });
        client.end();
    });
});

app.post('/add', (req, res) => {

    //getConnection to database to post data
    const client = new Client({
        connectionString: connectionString
    });
    client.connect();
    client.query("insert into todo (todo, description, isdone) values ( $1, $2, $3 )", [req.body.todo, req.body.description, req.body.isdone], (err, result) => {
        if(err) throw err
        client.end();
        res.redirect('/');
    });
});

app.delete('/delete/:id', (req, res) => {
    
    //getConnection to database to delete data
    const client = new Client({
        connectionString: connectionString
    });
    client.connect();
    client.query("delete from todo where id=$1", [req.params.id], (err, result) => {
        if(err) throw err
        client.end();
        res.sendStatus(200);
    });
});

app.post('/edit', (req, res) => {

    //getConnection to database to Update data
    const client = new Client({
        connectionString: connectionString
    });
    client.connect();
    client.query("update todo set todo=$1, description=$2, isdone=$3 where id=$4", 
            [req.body.todo, req.body.description, req.body.isdone, req.body.id], 
            (err, result) => {
        if(err) throw err
        client.end();
        res.redirect('/');
    });

});

//create Server
app.listen(3000, function () {
    console.log('Server Started at port 3000!');
});