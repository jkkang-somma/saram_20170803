// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// Session Service
var _ = require("underscore"); 
var debug = require('debug')('User');
var Schemas = require("../schemas.js");

var Session = function (data) {
   var schema=new Schemas('session');
   this.data = schema.get(data);
   return this.data;
}
module.exports = Session;