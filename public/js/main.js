async function loadUser(id, flags=null) {
    return await $.getJSON(`${identificatorHost}/u/${id}/json${flags != null ? '?f='+flags : ''}`);
}

function encode(str) {
    return str.replace(/[^]/g,e=>"&#"+e.charCodeAt(0)+";");
}

$(() => {
    $('[data-toggle="tooltip"]').tooltip(); //enable all tooltips
});