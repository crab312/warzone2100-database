var language_urls = {
    en: 'http://en.wzone2100.ru',
    ru: 'http://wzone2100.ru',
}


function site_language() {
    return 'en';
}

/* How to change language
 - set resulf of function 'site_language()'
 - change css span[lang = "en"] span[lang = "ru"]
*/

$(function () {
    if (site_language() != "en") {
        require('/data_master/namestxt_translated.js');
    }
});