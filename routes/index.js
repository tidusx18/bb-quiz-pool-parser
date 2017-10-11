var express = require('express');
var router = express.Router();
var parseController = require('../controllers/parseController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'BB Quiz Parser' });
});

/* POST formatted quiz to be parsed. */
router.post('/', parseController.parse_post);

module.exports = router;
