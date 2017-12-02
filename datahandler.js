const cheerio = require('cheerio');
const request = require('request');
const mongoose = require('mongoose');

// mongoose
var databaseUri = 'mongodb://localhost/newsScrape';
if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(databaseUri);
}

var db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on('error', function (err) {
	console.log('Mongoose Error : ' + err);
});

db.once('open', function () {
	console.log('Mongoose successfully connected to database.');
});

var articleSchema = mongoose.Schema({
	headline: String,
	link: String,
	image: String,
	comments: [{ name: String, text: String }],
});

var Post = mongoose.model('Post', articleSchema);

var dataHandler = {

	update: function (cb) {
		request('https://www.theguardian.com/us/technology', function (error, response, html) {
			if (!error && response.statusCode == 200) {

				var $ = cheerio.load(html);

				var counter1 = 0;
				var counter2 = 0;

				$('li.fc-slice__item').each(function (i, element) {
					counter1++;
					var headline = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__content').children('div.fc-item__header').children('h2.fc-item__title').children('a.fc-item__link').children('.u-faux-block-link__cta').children('span.js-headline-text').text();
					var link = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__content').children('div.fc-item__header').children('h2.fc-item__title').children('a.fc-item__link').attr('href');
					var image = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__media-wrapper').children('div.fc-item__image-container').children('picture').children('source').attr('srcset');

					if (headline && link && image) {

						counter2++;
						image = image.split(' ');

						var newPost = new Post({
							headline: headline,
							link: link,
							image: image[0],
							comments: [],
						});

						var query = { 'headline': newPost.headline };

						Post.findOneAndUpdate(query, newPost, { upsert: true }, function (err, doc) {
						});
					}
				});
				cb(true);
			} else {
				console.log("Error : " + error);
			}
			console.log(`Found [${counter2}] valid articles out of [${counter1}] possible that were found.`);
		});
	},

	retrieveAll: function (cb) {
		Post.find({}, function (err, results) {
			cb(results);
		});
	},

	retrieveOne: function (id, cb) {
		Post.findById(id, function (err, result) {
			if (err) throw err;
			cb(result);
		});
	},

	postComment: function (id, commentName, comment) {
		var newComment = {
			name: commentName,
			text: comment,
		};

		Post.update(
			{ _id: id },
			{ $push: { comments: newComment } }
		).then(() => {
			console.log(newComment);
		});
	},

	findComments: function (id, cb) {
		Post.findById(id, function (err, result) {
			if (err) throw err;
				cb(result.comments)
		});
	}
};

module.exports = dataHandler;