const cheerio = require('cheerio');
const request = require('request');
const mongojs = require('mongojs');

// mongodb
var db = mongojs('newsScrape', ['articles']);
db.articles.remove({});

var dataHandler = {

	update: function(cb) {
		request('https://www.theguardian.com/world', function (error, response, html) {
			if (!error && response.statusCode == 200) {
				console.log('Request successful! Updating database...');

				var $ = cheerio.load(html);

				var counter1 = 0;
				var counter2 = 0;

				$('li.fc-slice__item').each(function(i, element) {
					counter1++;
					var headline  = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__content').children('div.fc-item__header').children('h2.fc-item__title').children('a.fc-item__link').children('.u-faux-block-link__cta').children('span.js-headline-text').text();
					var link      = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__content').children('div.fc-item__header').children('h2.fc-item__title').children('a.fc-item__link').attr('href');
					var image     = $(element).children('div.fc-item').children('div.fc-item__container').children('div.fc-item__media-wrapper').children('div.fc-item__image-container').children('picture').children('source').attr('srcset');

					if (headline || link || image) {
						counter2++;
						var post = {
							headline: headline,
							link: link,
							image: image,
						};
						db.articles.insert(post);
					}
				});
			} else {
				console.log("Error : " + error);
			}
			console.log("Finished data request!");
			console.log(`Added [${counter2}] entries out of [${counter1}] that were scanned.`);
		});
		cb(true);
	}
};

module.exports = dataHandler;