var router = require('express').Router();
const db = require('../../models');
const fetch = require('node-fetch');
const cfg = require('../../cfg.json');

router.get('/', (req, res) => {
    res.render('group/invite');
});

router.post('/', (req, res) => {
    if (typeof req.body.user == 'string') {
        fetch(`${cfg.identificatorHost}/un/${req.body.user.replace('#', '%23')}/json?f=1`) //fetch the user's ID from identificator
            .then(res => res.json())
            .then(async user => {
                if (user == null) //if no identificator user could be found
                    return res.render('group/invite', {error: 'No user could be found by that username.'});
        
                if (await db.Invitation.count({where: {
                    group: res.locals.group.id,
                    user: user.id}
                }) > 0)
                    return res.render('group/invite', {error: 'This user has already been invited to this group.'});
        
                if (await db.Member.count({where: {
                    group: res.locals.group.id,
                    identificator: user.id}
                }) > 0)
                    return res.render('group/invite', {error: 'This user is already a member of this group.'});
        
                
                await db.Invitation.create({
                    group: res.locals.group.id,
                    user: user.id,
                });
                res.redirect('../'); //redirect back to group menu
            });
    }
});

module.exports = router;