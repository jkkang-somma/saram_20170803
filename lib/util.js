var _ = require("underscore"); 

var Util = function () {
};

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
	}

});



module.exports = new Util();