var sort = {col: 'name', direction: false};

function sortTable(name) {
    sort = {col: name, direction: name == sort.col ? !sort.direction : true};
    renderTable();
    $('th').each((i, e) => {
        e = $(e);
        e.find('span').html(sort.col == e.attr('name') ? (sort.direction ? '▼' : '▲') : ''); // ▲▼ ▴▾
    });
}

$('th').click(e => {
    e = $(e.target);
    if (e.prop('tagName') == 'SPAN')
        e = e.parent();
    sortTable(e.attr('name'))
});
sortTable('name');

function scoreSong(song) { //get the average rating of a song
    if (song.ratings.length > 0) {
        let total = song.ratings.reduce((a,b) => ({rating: a.rating+b.rating}), {rating: 0}).rating;
        song.score = Math.round(total / song.ratings.length);
    } else
        song.score = 0;
}

function readySong(song) {
    song.links = JSON.parse(song.links);
    scoreSong(song);
}

songs.forEach(song => readySong(song)); //ready all songs

function renderTable() {
    songs.sort((a, b) => { //sort songs
        a = a[sort.col];
        b = b[sort.col];
        if (typeof a == 'string') {
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        if (a > b)
            return sort.direction ? 1 : -1;
        if (a < b)
            return sort.direction ? -1 : 1;
        return 0;
    });

    let songTable = $('#songTable');
    songTable.empty();
    songs.forEach(song => {
        let row = $('<tr>');
        for (let i of ['name', 'artist', 'slot', 'user', 'score']) {
            let data = $('<td>');
            switch (i) {
                case 'name':
                    let linked = Object.keys(song.links).length > 0;
                    if (linked || song.note != null) {
                        data.html(`<a href="#" data-html="true" data-trigger="focus"${linked ? ` data-content="${Object.entries(song.links).map(link => (`<img src='/${link[0]}.png' width='16'><a href='${encode(link[1])}' target='_blank'>${encode(link[1])}</a>`)).join('<br>')}"` : ''}${song.note != null ? ` title="${song.note}"` : ''}>${encode(song.name)}${song.note != null ? ' <span class="badge badge-pill badge-info">i</span>' : ''}</a>`);
                        data.find('a').popover();
                    } else
                        data.text(song.name);
                    
                    break;
                case 'user':
                    data.html(names[song.user].name);
                    data.attr('title', names[song.user].tag);
                    data.tooltip();
                    break;
                case 'score':
                    data.html(`${song.ratings.length > 0 ? `<a href="#" data-html="true" data-trigger="focus" data-content="${song.ratings.map(rating => `${encode(names[rating.rater].name)}: ${rating.rating/10}${rating.note != null ? ` - ${encode(`"${rating.note}"`)}` : ''}`).join('<br>')}">` : ''}${song.score/10}${song.ratings.length > 0 ? '</a>' : ''}${song.user != userID ? ` <button class="btn btn-sm btn-${song.ratings.some(rating => rating.rater == userID) ? 'secondary' : 'success'}" onclick="rateSong('${song.id}')">Rate</button>` : ''}`);
                    data.find('a').popover();
                    break;
                default:
                    data.text(song[i]);
                    break;
            }
            row.append(data);
        }
        songTable.append(row);
    });
    //songs
}

renderTable();



const socket = io();

socket.on('connect', () => console.log('connected to socket.io'));

socket.on('slots', newSlots => slots = newSlots); //when number of group slots changes

socket.on('added', song => { //when a new song is added to the group
    readySong(song);
    songs.push(song);
    renderTable();
});

socket.on('rated', rating => { //when a new song is added to the group
    let song = songs.find(s => s.id == rating.song);
    song.ratings = song.ratings.filter(r => r.rater != rating.rater); //remove any conflicting ratings
    song.ratings.push(rating);
    scoreSong(song);
    renderTable();
});

socket.on('here', users => {
    $('#users').empty(); //clear the user images
    users.forEach(user => {
        let el = $(`<img class="rounded border border-dark" title="${user.name}" src="${identificatorHost}/avatar/${user.id}.png?size=50">`)
        el.tooltip();
        $('#users').append(el);
    });
});

socket.on('disconnect', () => bootbox.alert('Disconnected from the server.', () => window.location.reload()));