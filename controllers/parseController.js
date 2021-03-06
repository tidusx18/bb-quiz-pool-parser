// var bbQuizParser = require('../api/bb/bbQuizParser');
var bbQuizParser = require('../api/quizParser');

// Handle parsing quiz on POST
exports.parse_post = function(req, res, next) {
	res.render('result', { title: 'Download Starting...' }, function(err, html) {
		// Parse quiz
		let pool = new bbQuizParser(req.body['quizpool']);
		pool.evaluatePool();
		console.log(pool.questionsToCSV());
		
		let results = pool.questionsToCSV();
		res.set({"Content-Disposition":"attachment; filename=\"sample.txt\""});
		res.send(results);
	});
}