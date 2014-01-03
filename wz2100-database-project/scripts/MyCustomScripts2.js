/*
	This file is part of 'Warzone 2100 Guide by crab'.

	'Warzone 2100 Guide by crab' is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 2 of the License, or
	(at your option) any later version.

	'Warzone 2100 Guide by crab' is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with 'Warzone 2100 Guide by crab'; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
*/

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

Number.prototype.tohhMMSS = function () {
    if (this > 3600)
        return this.toHHMMSS();
    else
        return this.toMMSS();
}

Number.prototype.toInt = function () {
    return Math.floor(this);
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

function url_pushState(querystr) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + querystr;
    window.history.pushState({ path: newurl }, '', newurl)
}

function scrollToId(elem_id) {
    $('html, body').animate({
        scrollTop: $(elem_id).offset().top
    }, 1000);
}


