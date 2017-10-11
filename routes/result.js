var express = require('express');
var router = express.Router();
var resultController = require('../controllers/resultController');

/* POST formatted quiz to be parsed. */
router.get('/', parseController.result_get);

module.exports = router;
