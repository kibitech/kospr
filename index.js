'use strict';

var server = require('./lib/server/server.js');
var api    = require('./lib/API/api.js');

var version = "v.0.1.0";
var ascii = "" +   
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

module.exports =
{
  /**
  * Void function
  * @param {} void
  * @return {string}
  */
  version : function() {
    console.log(ascii)
    return version;
  },
  /**
  * Void function
  * @param {} void
  * @return {string}
  */
  power_on : function() {
    console.log("*** Kosper "+version+" is running ***")
    return true;
  },
  /**
  * Void function
  * @param {} void
  * @return {string}
  */
  power_off : function() {
    console.log("*** Kosper "+version+" is stopped ***")
    return false;
  },
  /**
  * Void function
  * @param {} void
  * @return {string}
  */
  restart : function()
  {
    console.log("*** Kosper "+version+" is restaring ***")
    this.power_off();
    this.power_on();
    return true;
  },
  
  status : function()
  {
    /**
    * Void function
    * Pending: how to check status and rerturn based on this
    * @param {} void
    * @return {string}
    */
    console.log("*** Kosper "+version+" is running ***")
    return true
  }
}

//module.exports.Server = require("./lib/server");

