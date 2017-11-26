const cheerio = require('cheerio');
const request = require('request');
const mongojs = require('mongojs');
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
// });

// mongodb
var db = mongojs('newsScrape', ['articles']);
var db2 = mongojs('newsScrape', ['comments']);
var ObjectId = mongojs.ObjectId;

var dataHandler = {

	update: function(cb) {
		request('https://www.theguardian.com/us/technology', function (error, response, html) {
			if (!error && response.statusCode == 200) {

				var $ = cheerio.load(html);

				var counter1 = 0;
				var counter2 = 0;

				$('li.fc-slice__item').each(function(i, element) {
					counter1++;
					var headline  = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__content').children('div.fc-item__header').children('h2.fc-item__title').children('a.fc-item__link').children('.u-faux-block-link__cta').children('span.js-headline-text').text();
					var link      = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__content').children('div.fc-item__header').children('h2.fc-item__title').children('a.fc-item__link').attr('href');
					var image     = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__media-wrapper').children('div.fc-item__image-container').children('picture').children('source').attr('srcset');

					if (headline && link && image) {

						counter2++;
						image = image.split(' ');

						var post = {
							headline: headline,
							link: link,
							image: image[0],
						};
						db.articles.update(post, post, {upsert:true});
					}
				});
				cb(true);
			} else {
				console.log("Error : " + error);
			}
			console.log(`Found [${counter2}] valid articles out of [${counter1}] possible that were found.`);
		});
	},

	retrieveAll: function(cb) {
		db.articles.find(function (err, docs) {
			cb(docs);
		});
	},

	retrieveOne: function(id, cb) {
		db.articles.findOne({"_id": ObjectId(id)}, function(err, result) {
			if (err) throw err;
			cb(result);
		});
		// cb(db.articles.find('ObjectId("' + id + '")'));
	},

	postComment: function(id, commentName, comment) {
		var post = {
			article_id: id,
			name: commentName,
			text: comment
		};
		
		db.comments.update(post, post, {upsert:true});
	},

	findComments: function(id, cb) {
		db2.comments.find({"article_id": id}, function(err, result) {
			if (err) throw err;
			cb(result);
		});
	}
};

module.exports = dataHandler;