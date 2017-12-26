/**
 * author: andreas johan virkus
 * snippet url: https://gist.github.com/andreasvirkus/bfaedc839de0d46ffe4c
 * 
 * Remove classes that have given prefix
 * Example: You have an element with classes "apple juiceSmall juiceBig banana"
 * You run:
 *   $elem.removeClassPrefix('juice');
 * The resulting classes are "apple banana"
 */
$.fn.removeClassPrefix = function (prefix) {
    this.each( function ( i, it ) {
        var classes = it.className.split(" ").map(function (item) {
            return item.indexOf(prefix) === 0 ? "" : item;
        });
        it.className = classes.join(" ");
    });

    return this;
};

/**
 * "http://dummy.com/?technology=jquery&blog=jquerybyexample". 
 * 1 var tech = GetURLParameter('technology');
 * 2 var blog = GetURLParameter('blog');
 */
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};