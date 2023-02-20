var express = require('express');
var router = express.Router();

const {positions}=require('../controllers/mobile')
/* GET home page. */
router.get('/positions',positions);

module.exports = router;
