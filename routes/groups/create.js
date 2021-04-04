var router = require('express').Router();
const db = require('../../models');

router.get('/', (req, res) => {
    res.render('groups/create');
});

router.post('/', async (req, res) => {
    if (await db.Group.count({where: {owner: req.user.id}}) >= 10) res.send('You have reached the maximum of 10 groups owned. Go delete an old group before making a new one.');
    if (typeof req.body.name == 'string' && req.body.name.length > 0 && req.body.name.length <= 100) {
        let group = await db.Group.create({
            name: req.body.name,
            owner: req.user.id,
            slots: 1,
        });
        await db.Member.create({
            group: group.id,
            identificator: req.user.id,
        });
        res.redirect(`/g/${group.id}`);
    } else
        res.send('Something happened and your group was not created. <a href="/groups">Return to groups menu?</a>');
});

module.exports = router;