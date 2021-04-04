var router = require('express').Router();
const db = require('../../models');

router.get('/', async (req, res) => {
    let invitations = await db.Invitation.findAll({where: {user: req.user.id}});
    await Promise.all(invitations.map(invitation => new Promise(async resolve => {
        invitation.group = await db.Group.findOne({where: {id: invitation.group}});
        resolve();
    })));
    res.render('groups/invitations', {invitations});
});

router.post('/', async (req, res) => {
    if (typeof req.body.group == 'string') {
        let where = {where: {
            group: req.body.group,
            user: req.user.id,
        }};
        let invitation = await db.Invitation.findOne(where);
        if (invitation != null) {
            await db.Invitation.destroy(where); //delete the invitation
            if (req.body.response == 'a') { //if the invitation was accepted
                await db.Member.create({ //add the user as a member of the group
                    group: invitation.group,
                    identificator: req.user.id,
                });
                res.redirect(`/g/${invitation.group}`); //redirect them to the group menu
            } else { //if the invitation was rejected
                res.redirect('./'); //redirect them back to the invitation menu
            }
        } else res.send('could not find that invitation');
    } else res.send('something happened');
});

module.exports = router;