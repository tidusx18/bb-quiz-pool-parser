var express = require('express');
var router = express.Router();
var parseController = require('../controllers/parseController');

/* POST formatted quiz to be parsed. */
router.post('/', parseController.parse_post);

module.exports = router;
