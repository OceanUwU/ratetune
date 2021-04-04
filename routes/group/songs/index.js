var router = require('express').Router();
//const db = require('../../../models');

router.use('/', require('./home'));

module.exports = router;