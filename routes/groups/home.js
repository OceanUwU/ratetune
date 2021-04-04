var router = require('express').Router();
const db = require('../../models');

router.get('/', async (req, res) => {
    let groups = await Promise.all((await db.Member.findAll({where: {identificator: req.user.id}}))
        .map(async member => db.Group.findOne({where: {id: member.group}})));
    let invitations = await db.Invitation.count({where: {user: req.user.id}});
    res.render('groups/home', {groups, invitations});
});

module.exports = router;