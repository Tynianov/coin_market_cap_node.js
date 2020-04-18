var express = require('express');
var router = express.Router();
const apiControllers = require('../controllers/api_controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const apiRoute = '/api/v1';

router.get(apiRoute+'/currency-list', apiControllers.getCurrenciesList)
router.get(apiRoute+'/currency-metadata/:id', apiControllers.getCurrencyMetadata)
router.get(apiRoute+'/currency-quotes/:id', apiControllers.getCurrencyQuotes)
router.get(apiRoute+'/test/:id', apiControllers.testController)

module.exports = router;
