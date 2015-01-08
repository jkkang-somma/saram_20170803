var express = require('express');
var debug = require('debug')('rawDataRouter');
var router = express.Router();

var RawData = require("../service/RawData.js")

router.route('/bulk')
.post(function(req, res){
    var data = req.body;

    var count = 0;    
    for(var key in data){
        var rawData = RawData(data[key]);
        rawData.insertRawData();
        count++;
    }
    debug("Add RawData Count : " + count);
    res.send({msg : "Add RawData Count : " + count, count: count});
});


// router.route('/upload')
// .post(function(req, res){
    // fs.readFile(req.files.file.path, function(err, data){
    //     var getFilename= function() {
    //         var date = new Date();
    //         var yyyy = date.getFullYear().toString();
    //         var mm = (date.getMonth()+1).toString();
    //         var dd  = date.getDate().toString();
           
    //         return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]) + ".csv";
    //     };
        
    //     var filePath = __dirname + path.sep + ".."+ path.sep + "files" + path.sep+ getFilename();
        
    //     data = iconv.convert(data);
        
    //     var parseData = csvParser(data.toString(), ",");
    //     //debug(parseData);
        
    //     fs.writeFile(filePath, data, function(err){
    //         if(err)
    //             throw err;
    //         else{
    //             res.end();
    //         }
    //     });
        
        
    // })
// });


module.exports = router;
