var router = require('express').Router();
const slash = require('express-slash');

//function to require authentication for a route
const requireAuth = require('./requireAuth');

router.use('/', require('./auth'));
router.use('/', require('./home'));

router.use(slash());

router.use('/groups/', requireAuth, require('./groups'));
router.use('/g/:groupID/', requireAuth, require('./group'));
//router.use('/g', (req, res) => res.redirect('/groups'));

module.exports = router;