const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// express
const app = express();

// handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// mongoose
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
mongoose.Promise = global.Promise;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var routes = require('./routes/router.js');

app.use('/', routes);

app.get('/', (req, res) => res.send('Hello World!'));

var port = 8080;
app.listen(port, () => console.log('News-Scraper listening on port ' + port + "."));