$('.inviter').each(async (i, e) => {
    e = $(e);
    let user = await loadUser($(e).html(), '4');
    e.html(user.dName.tag);
});