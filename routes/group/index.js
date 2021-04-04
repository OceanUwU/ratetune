var router = require('express').Router({mergeParams: true});
const db = require('../../models');

router.use(async (req, res, next) => {
    res.locals.group = await db.Group.findOne({where: {id: req.params.groupID}});
    if (res.locals.group == null)
        return res.send('No group exists with that ID.');

    res.locals.member = await db.Member.findOne({where: {
        group: res.locals.group.id,
        identificator: req.user.id,
    }});
    if (res.locals.member == null)
        return res.send('You are not a part of this group.');
    
    next();
});

const requireOwner = (req, res, next) => {
    if (res.locals.group.owner != req.user.id)
        return res.send('You are not the owner of this group.');
    next();
};

router.use('/', require('./home'));
router.use('/songs/', require('./songs'));
router.use('/addslot', requireOwner, require('./addslot'));
router.use('/invite/', requireOwner, require('./invite'));
router.use('/delete', requireOwner, require('./delete'));
router.use('/leave', require('./leave'));

module.exports = router;