'use strict';

/**
 * Adds commas to a number
 * @param {number} number
 * @param {string} locale
 * @return {string}
 */

/*var ascii = "" +   
" +-----------------------------+ \n"+
" |  _____                      | \n"+
" | |  |  |___ ___ ___ ___      | \n"+
" | |    -| . |_ -| . |  _|     | \n"+
" | |__|__|___|___|  _|_|       | \n"+
" |               |_| v.0.1.0   | \n"+
" +-----------------------------+ \n" +
" |                             | \n" +
" |              +              | \n" +
" |              |              | \n" +
" |          +--------          | \n" +
" |         +         +         | \n" +
" |       +-+         +-+       | \n" +
" |       |             |       | \n" +
" |       |             |       | \n" +
" |  +-----------------------+  | \n" +
" |  | +-------------------+ |  | \n" +
" |  | |                   | |  | \n" +
" |  | |                   | |  | \n" +
" |  | +-------------------+ |  | \n" +
" |  +-----------------------+  | \n" +
" |      | +-----------+ |      | \n" +
" |      | |           | |      | \n" +
" |      | +-----------+ |      | \n" +
" |      +---------------+      | \n" +
" |         Kibitech PR         | \n" +
" +-----------------------------+ \n" ;

console.log(ascii);*/

module.exports = function(number, locale) {
    return number.toLocaleString(locale);
};

//module.exports.Server = require("./lib/server");

