var crypto = require('crypto');
 
exports.encrypte = function(dest){
    var shasum = crypto.createHash('sha1');
    shasum.update(dest);
    return shasum.digest('hex');
}
