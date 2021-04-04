const db = require('../../../models');

module.exports = async function addSong(socket, io, group, details) {
    if (typeof details != 'object') return; //if the details are not in object form

    //validate slot
    details.slot = Number(details.slot); //convert string to number
    if (!Number.isInteger(details.slot)) return; //if the slot is not an integer
    if (details.slot < 1 || details.slot > group.slots) return; //if the slot provided is not a slot in the group
    console.log(await db.Song.count({where: {user: socket.request.user.id, group: group.id, slot: details.slot}}))
    if (await db.Song.count({where: {user: socket.request.user.id, group: group.id, slot: details.slot}}) > 0) return; //if the slot provided has already been used by the user

    //validate name, artist, note
    if (typeof details.name != 'string' || details.name.length <= 0 || details.name.length > 100) return; //validate name
    if (typeof details.artist != 'string' || details.artist.length <= 0 || details.artist.length > 100) return; //validate artist
    if (typeof details.note != 'string' || details.note.length <= 0 || details.note.length > 100) details.note = null; //validate note

    //validate links
    let links = {};
    for (let i of ['spotify', 'youtube', 'soundcloud']) { //for each possible site
        let link = details[`${i}URL`]; //find the link provided by the user
        if (typeof link == 'string' && link.length > 0 && link.length <= 100) //if a link was provided for this site
            links[i] = details[`${i}URL`]; //store it
    }

    //create song
    let song = await db.Song.create({
        group: group.id,
        user: socket.request.user.id,
        slot: details.slot,
        name: details.name,
        artist: details.artist,
        note: details.note,
        links: JSON.stringify(links),
    });
    song.dataValues.ratings = [];
    
    //emit new song
    io.to(group.id).emit('added', song);
};