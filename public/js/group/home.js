(async () => {
    let owner = await loadUser($('#ownerName').html(), 'h36');
    $('#ownerAvatar').attr('src', owner.avatarURL+'?size=32');
    $('#ownerName').html(`${owner.dName.name}<span style="font-size:0.6em">#${owner.dName.discrim}</span>`);

    $('.member').each(async (i, e) => {
        e = $(e);
        let user = await loadUser($(e).attr('data-id'), 'h33');
        e.attr('src', user.avatarURL+'?size=64');
        e.attr('data-html', 'true');
        e.attr('title', `<img class="rounded" src='${identificatorHost}/card/${user.id}.png?o=l&t=d&b&bg'>`);
        e.tooltip();
    });
})();

function addSlot() {
    $.post('addslot', {}, data => {
        if (typeof data == 'number')
            $('#slots').html(data)
        else if (typeof data == 'string')
            bootbox.alert(data);
    });
}

function deleteGroup() {
    bootbox.confirm("Are you sure you want to PERMANENTLY delete this group, all its songs, and all its ratings? This is irreversible.", async result => {
        if (result == true)
            $.post('delete', {}, () => window.location.replace('/groups'));
    });
}

function leaveGroup() {
    bootbox.confirm("Are you sure you want to leave this group? All of your ratings and your songs (along with their ratings) will be deleted permanently.", async result => {
        if (result == true)
            $.post('leave', {}, () => window.location.replace('/groups'));
    });
}