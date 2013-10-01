function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function ShowLoading(container_id) {
    $('#' + container_id).block({
        message: null,
    });
}

function HideLoading(container_id) {
    $('#' + container_id).unblock();
}

function ResetGridContainer(container_id, toolbar_on) {
    $("#" + container_id).empty();
    var table_id = container_id + "_table";
    if (toolbar_on) {
        $("#" + container_id).html('<table id="' + table_id + '"></table><div id="' + table_id + '_toolbar"></div>');
    } else {
        $("#" + container_id).html('<table id="' + table_id + '"></table>');
    }
    return "#" + table_id;
}

Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
        hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

Number.prototype.toMMSS = function () {
    var seconds = Math.floor(this);
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds;
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}