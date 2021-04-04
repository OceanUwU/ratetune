var router = require('express').Router();
const db = require('../../models');
const io = require('../../index.js');
const maxSlots = 1000;

router.post('/', async (req, res) => {
    if (res.locals.group.slots < maxSlots) {
        await db.Group.update({slots: ++res.locals.group.slots}, {where: {id: res.locals.group.id}});
        res.json(res.locals.group.slots);
        io.to(res.locals.group.id).emit('slots', res.locals.group.slots);
    } else
        res.json(`You've reached the maximum number of song slots (${maxSlots})!`);
});

module.exports = router;