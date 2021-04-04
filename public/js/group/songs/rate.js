function rateSong(id) {
    let song = songs.find(s => s.id == id);

    let diag = bootbox.dialog({
        message: $('#rateSongMenu').clone().html(),
        closeButton: true,
        size: 'large',
        buttons: {
            cancel: {
                label: "Cancel",
            },
            ok: {
                label: "Rate",
                callback: () => {
                    let details = {
                        song: song.id,
                        rating: diagContent.find('[name="rating"]').val(),
                        note: diagContent.find('[name="note"]').val(),
                    };
                    socket.emit('rate', details);
                }
            }
        }
    });

    diagContent = $(diag.children().children().children()[0]);

    diagContent.find('.song-name').text(song.name);
    diagContent.find('.song-artist').text(song.artist);

    let myRating = song.ratings.find(r => r.rater == userID);
    if (myRating != undefined) {
        diagContent.find('[type="range"]').val(myRating.rating/10);
        diagContent.find('[type="number"]').val(myRating.rating/10);
        diagContent.find('[name="note"]').val(myRating.note == null ? '' : myRating.note);
    }

    diagContent.find('[type="range"]').on('input', e => {
        diagContent.find('[type="number"]').val(e.target.value);
    });
    diagContent.find('[type="number"]').change(e => {
        diagContent.find('[type="range"]').val(e.target.value);
    });
}