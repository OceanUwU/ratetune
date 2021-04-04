var router = require('express').Router();
const db = require('../../models');

router.get('/', async (req, res) => {
    let members = await db.Member.findAll({where: {group: res.locals.group.id}});
    let invitations = await db.Invitation.findAll({where: {group: res.locals.group.id}});
    res.render('group/home', {members, invitations});
});

module.exports = router;