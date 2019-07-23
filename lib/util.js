var _ = require("underscore"); 
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var Util = function () {
};

var staticTransport = undefined;

_.extend(Util.prototype, {

	getzFormat : function(s, len) {
	    var sZero = "";
	    s = s + "";
	    if (s.length < len) {
	        for (var i = 0; i < (len - s.length); i++) {
	            sZero += "0";
	        }
	    }
	    return sZero + s;
  },
  
  getEmailTransport: function() {
    if (staticTransport === undefined) {
      staticTransport = nodemailer.createTransport(smtpTransport({
        host: 'wsmtp.ecounterp.com',
        port: 587,
        auth: {
          user: 'webmaster@yescnc.co.kr',
          pass: 'yes112233'
        },
        rejectUnauthorized: false,
        connectionTimeout:10000
      }));
    }
    
  
    return staticTransport;
  }

});



module.exports = new Util();