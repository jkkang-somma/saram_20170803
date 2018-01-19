var express = require('express');
var _ = require('underscore');
var debug = require('debug')('IpAssignedManagerRouter');
var router = express.Router();
var IpAssignedManager = require('../service/IpAssignedManager.js');
var User = require('../service/User.js');

router.route('/IPsearch')
.get(function(req, res){
	// IpAssignedManager.getIPsearch(req.query).then(function(result){
	// 	res.send(result);
	// });
	var ipAssignedManager = new IpAssignedManager();
    var result = ipAssignedManager.getIPsearch().then(function(result){
        debug("Complete Select IP List.");
        res.send(result);
    }).catch(function(e){
        debug("Error Select IP List.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
})
.put(function(req, res){
	var ipAssignedManager = new IpAssignedManager(req.body);

	ipAssignedManager.updateIP().then(function(){
        debug("Complete update IP.");
        res.send({success:true, message:"Complete update IP."});
    }).catch(function(e){
        debug("Error update IP.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
})
.post(function(req, res){
	var ipAssignedManager = new IpAssignedManager(req.body);

	ipAssignedManager.insertIP().then(function(){
        debug("Complete insert IP.");
        res.send({success:true, message:"Complete insert IP."});
    }).catch(function(e){
        debug("Error insert IP.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

router.route('/IPsearch/:ip')
.delete(function(req, res){
    var _ip=req.param("ip");
	var ipAssignedManager = new IpAssignedManager({ip:_ip});

	ipAssignedManager.removeIP().then(function(){
        debug("Complete Delete IP.");
        res.send({success:true, message:"Complete Delete IP."});
    }).catch(function(e){
        debug("Error Delete IP.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
})
.put(function(req, res){
	var ipAssignedManager = new IpAssignedManager(req.body);

	ipAssignedManager.updateIP().then(function(){
        debug("Complete update IP.");
        res.send({success:true, message:"Complete update IP."});
    }).catch(function(e){
        debug("Error update IP.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});
// .put(function(req, res){
//     var _ip=req.param("ip");
// 	var ipAssignedManager = new IpAssignedManager({ip:_ip});

// 	ipAssignedManager.updateIP().then(function(){
//         debug("Complete update IP.");
//         res.send({success:true, message:"Complete update IP."});
//     }).catch(function(e){
//         debug("Error update IP.");
//         res.status(500);
//         res.send({
//             success:false,
//             message: e.message,
//             error:e
//         });
//     });
// })
// .post(function(req, res){
//     var _ip=req.param("ip");
// 	var ipAssignedManager = new IpAssignedManager({ip:_ip});

// 	ipAssignedManager.function().then(function(){
//         debug("Complete insert IP.");
//         res.send({success:true, message:"Complete insert IP."});
//     }).catch(function(e){
//         debug("Error insert IP.");
//         res.status(500);
//         res.send({
//             success:false,
//             message: e.message,
//             error:e
//         });
//     });
// });
module.exports = router;
