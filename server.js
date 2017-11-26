const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

// express
const app = express();

// handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// serve public files
app.use("/public", express.static('public'));

var routes = require('./routes/router.js');

app.use('/', routes);

var port = 8080;
app.listen(port, () => console.log('News-Scraper listening on port ' + port + "."));