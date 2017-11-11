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