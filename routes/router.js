const express     = require('express');
const dataHandler = require('../datahandler.js');


// express
var router = express.Router();

// data route
router.get('/', function(req, res) {

	// On home load, get new articles and load them into main page


	dataHandler.update(function(response) {
		if (response === true) {
			displayHome();
		}
	});

	var displayData = {
		data: [],
		row: [],
	};

	function displayHome() {
		dataHandler.retrieveAll(function(articles) {
			for (i=0; i<articles.length; i++) {
				displayData.data.push(articles[i]);
				if ((i+1)% 3 === 0) {
					displayData.data[i].row = true;
				}
			}
			res.render('home', displayData);
		});
	}
});

router.post("/data/post/:id", function(req, res) {
	var id = req.params.id;
	dataHandler.postComment(id, req.body.name, req.body.comment);
});

router.get("/data/comments/:id", function(req, res) {
	var id = req.params.id;

	var content = {};

	dataHandler.retrieveOne(id, (response) => {
		content.article = response;

		dataHandler.findComments(id, (response) => {
			displayComments();
		});
	});

	function displayComments() {
		res.render('comment', content);
	}

});

module.exports = router;