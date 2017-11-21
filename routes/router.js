const express     = require('express');
const dataHandler = require('../datahandler.js');

// express
var router = express.Router();

// data route
router.get('/data', function(req, res) {

	var success;

	dataHandler.update(function(response) {
		if (response === true) {
			success = true;
		}
	});

	res.render('home', {
		success: success,
		helpers: {
			foo: function() {
				return 'foo.';
			},
			bar: function() {
				return 'bar';
			}
		}
	});
});

module.exports = router;