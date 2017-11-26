const express     = require('express');
const dataHandler = require('../datahandler.js');


// express
var router = express.Router();

// data route
router.get('/', function(req, res) {

	// On home load, get new articles and load them into main page

	console.log('Requesting updated data.');
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
			if (displayData.data.length > 3) {console.log('Data has returned successfully.');}
			res.render('home', displayData);
		});
	}
});

router.post("/data/post/:id", function(req, res) {
	var id = req.params.id;
	console.log("-------------\n\n\n");
	console.log("Recieved post request from " + req.body.name + " for article with id of " + id + ".");
	console.log("\n\n\n-------------");
	dataHandler.postComment(id, req.body.name, req.body.comment);
});

router.get("/data/comments/:id", function(req, res) {
	var id = req.params.id;
	console.log('Requesting comments page...');
	console.log(`Id is set to: ${id}`);

	var content = {};

	dataHandler.retrieveOne(id, (response) => {
		console.log("Content retrieved:");
		console.log(JSON.stringify(response, null, 2));
		content.article = response;

		dataHandler.findComments(id, (response) => {
			console.log(response);
			content.comments = response;
			displayComments();
		});
	});

	function displayComments() {
		console.log("Content:");
		console.log(JSON.stringify(content, null, 2));

		res.render('comment', content);
	}

});

module.exports = router;