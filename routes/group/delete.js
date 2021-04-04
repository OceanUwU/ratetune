var router = require('express').Router();
const db = require('../../models');

router.post('/', async (req, res) => {
    console.log(res.locals.group.name);
    (await db.Song.findAll({where: {group: res.locals.group.id}})).forEach(async song => {
        await db.Rating.destroy({where: {song: song.id}});
        await db.Song.destroy({where: {id: song.id}});
    });
    await db.Member.destroy({where: {group: res.locals.group.id}});
    await db.Invitation.destroy({where: {group: res.locals.group.id}});
    await db.Group.destroy({where: {id: res.locals.group.id}});
    res.redirect('/groups');
});

module.exports = router;