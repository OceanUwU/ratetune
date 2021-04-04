const db = require('../../../models');

module.exports = async function rateSong(socket, io, group, details) {
    if (typeof details != 'object') return; //if the rating details are not in object form, return
    
    //validate details
    if (typeof details.song != 'string') return;
    let song = await db.Song.findOne({where: {id: details.song, group: group.id}});
    if (song == null) return; //if song doesn't exist or is from another group, return
    if (song.user == socket.request.user.id) return; //if this song was added by the user trying to rate it, return
    details.rating = Math.round(Number(details.rating)*10); //convert rating to number
    if (!Number.isInteger(details.rating) || details.rating < 0 || details.rating > 100) return; //validate rating
    if (typeof details.note != 'string' || details.note.length <= 0 || details.note.length > 100) details.note = null; //validate note

    //create or update rating
    let rating;
    let where = {where: {song: song.id, rater: socket.request.user.id}};
    if (await db.Rating.count(where) > 0) {
        await db.Rating.update({
            rating: details.rating,
            note: details.note,
        }, where);
        rating = await db.Rating.findOne(where);
    } else
        rating = await db.Rating.create({
            song: song.id,
            rater: socket.request.user.id,
            rating: details.rating,
            note: details.note,
        });

    //emit new rating
    io.to(group.id).emit('rated', rating);
};