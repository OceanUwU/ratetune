var router = require('express').Router();
const db = require('../../../models');
const fetch = require('node-fetch');
const cfg = require('../../../cfg.json');
const io = require('../../../index.js');
const addSong = require('./add');
const rateSong = require('./rate');

router.get('/', async (req, res) => {
    let songs = await db.Song.findAll({where: {group: res.locals.group.id}});
    await Promise.all(songs.map(song => new Promise(async resolve => {
        song.dataValues.ratings = await db.Rating.findAll({where: {song: song.id}});
        resolve();
    })));

    let names = Object.fromEntries(await Promise.all((await db.Member.findAll({where: {group: res.locals.group.id}})).map(member => new Promise(resolve =>
        fetch(`${cfg.identificatorHost}/u/${member.identificator}/json?f=4`)
            .then(res => res.json())
            .then(user => resolve([member.identificator, user.dName]))
    ))));

    res.render('group/songs/home', {songs, names});
});

function here(group) {
    let users = [];
    let room = io.of('/').adapter.rooms.get(group.id);
    if (room != null) {
        room.forEach((v1, v2, set) => {
            let socket = io.sockets.sockets.get(v2)
            if (socket) {
                let user = socket.request.user;
                users.push({
                    id: user.id,
                    name: user.dName.tag,
                });
            }
        });
    
        io.to(group.id).emit('here', users);
    }
}

io.on('connection', async socket => {
    let group;
    try {
        group = socket.handshake.headers.referer.slice(socket.handshake.headers.referer.indexOf('/g/')+'/g/'.length).slice(0, 36);
    } catch(e) {
        return socket.disconnect();
    }

    group = await db.Group.findOne({where: {id: group}});
    if (group == null)
        return socket.disconnect();
    if (!socket.request.user.logged_in || await db.Member.count({where: {group: group.id, identificator: socket.request.user.id}}) == 0)
        return socket.disconnect();
    
    socket.join(group.id);
    here(group);
    
    socket.on('add', details => addSong(socket, io, group, details));
    socket.on('rate', details => rateSong(socket, io, group, details));

    socket.on('disconnect', () => here(group));
});

module.exports = router;