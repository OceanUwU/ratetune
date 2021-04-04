var router = require('express').Router();
const db = require('../../models');

router.post('/', async (req, res) => {
    (await db.Song.findAll({where: {group: res.locals.group.id, user: req.user.id}})).forEach(async song => {
        await db.Rating.destroy({where: {song: song.id}});
        await db.Song.destroy({where: {id: song.id}});
    });
    (await db.Rating.findAll({where: {rater: req.user.id}})).forEach(async rating => { //for each of the user's ratings
        let song = await db.Song.findOne({where: {id: rating.song}}); //find the song this rating belongs to
        if (song.group == res.locals.group.id) //if this song is from the group being left
            db.Rating.destroy({where: {id: rating.id}}); //delete this rating
    });
    await db.Member.destroy({where: {group: res.locals.group.id, identificator: req.user.id}});
    res.redirect('/groups');
});

module.exports = router;