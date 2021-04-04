var router = require('express').Router();

router.use('/', require('./home'));
router.use('/create', require('./create'));
router.use('/invitations', require('./invitations'));

module.exports = router;