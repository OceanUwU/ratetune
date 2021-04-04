function addSongDetails() {
    let slotsAvailable = Array.from({length: slots}, (_, i) => i + 1);
    songs.filter(song => song.user == userID).forEach(song => slotsAvailable.splice(slotsAvailable.indexOf(song.slot), 1));

    if (slotsAvailable.length > 0) {
        let diagContent = $('#addSongDetails').clone();
        slotsAvailable.forEach(slot => diagContent.find('[name="slot"]').append($(`<option>${slot}</option>`)));
    
        let diag = bootbox.dialog({
            message: diagContent.html(),
            closeButton: true,
            size: 'large',
            buttons: {
                cancel: {
                    label: "Cancel",
                },
                ok: {
                    label: "Add",
                    callback: () => {
                        let details = {};
                        for (let i of ['name', 'artist', 'slot', 'spotifyURL', 'youtubeURL', 'soundcloudURL', 'note'])
                            details[i] = diagContent.find(`[name="${i}"]`).val();
                        socket.emit('add', details);
                    }
                }
            }
        });
    
        diagContent = $(diag.children().children().children()[0]);
    } else {
        bootbox.alert('You don\'t have any song slots left.');
    }
}