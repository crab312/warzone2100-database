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




/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.browser.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: http://pupunzi.com
 *  blog: http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 02/10/13 22.42
 *  *****************************************************************************
 *
 * jquery.mb.browser
 * Author: pupunzi
 * Creation date: 16/01/13
 *
 ******************************************************************************/
/*Browser detection patch*/

(function ($) {

    if (jQuery.browser) return;

    jQuery.browser = {};
    jQuery.browser.mozilla = false;
    jQuery.browser.webkit = false;
    jQuery.browser.opera = false;
    jQuery.browser.msie = false;

    var nAgt = navigator.userAgent;
    jQuery.browser.ua = nAgt;

    jQuery.browser.name = navigator.appName;
    jQuery.browser.fullVersion = '' + parseFloat(navigator.appVersion);
    jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        jQuery.browser.opera = true;
        jQuery.browser.name = "Opera";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1) jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
    }

        // In MSIE < 11, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        jQuery.browser.msie = true;
        jQuery.browser.name = "Microsoft Internet Explorer";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 5);
    }

        // In TRIDENT (IE11) => 11, the true version is after "rv:" in userAgent
    else if (nAgt.indexOf("Trident") != -1) {
        jQuery.browser.msie = true;
        jQuery.browser.name = "Microsoft Internet Explorer";
        var start = nAgt.indexOf("rv:") + 3;
        var end = start + 4;
        jQuery.browser.fullVersion = nAgt.substring(start, end);
    }

        // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Chrome";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
    }
        // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Safari";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1) jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
    }
        // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("AppleWebkit")) != -1) {
        jQuery.browser.webkit = true;
        jQuery.browser.name = "Safari";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1) jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
    }
        // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        jQuery.browser.mozilla = true;
        jQuery.browser.name = "Firefox";
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 8);
    }
        // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        jQuery.browser.name = nAgt.substring(nameOffset, verOffset);
        jQuery.browser.fullVersion = nAgt.substring(verOffset + 1);
        if (jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase()) {
            jQuery.browser.name = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = jQuery.browser.fullVersion.indexOf(";")) != -1) jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix);
    if ((ix = jQuery.browser.fullVersion.indexOf(" ")) != -1) jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix);

    jQuery.browser.majorVersion = parseInt('' + jQuery.browser.fullVersion, 10);
    if (isNaN(jQuery.browser.majorVersion)) {
        jQuery.browser.fullVersion = '' + parseFloat(navigator.appVersion);
        jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
    }
    jQuery.browser.version = jQuery.browser.majorVersion;
})(jQuery);

//http://stackoverflow.com/questions/14488774/using-html-in-a-dialogs-title-in-jquery-ui-1-10
//This will override the function used when setting jQuery UI dialog titles, allowing it to contain HTML.
$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function (title) {
        if (!this.options.title) {
            title.html("&#160;");
        } else {
            title.html(this.options.title);
        }
    }
}));