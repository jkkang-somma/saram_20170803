// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery', 
  'underscore', 
  'backbone',
  'log',
  'views/LodingView',
  'collection/sm/UserCollection'
], function($, _, Backbone, log, LodingView, UserCollection){
    var LOG=log.getLogger("LODING");
    var lodingView;
    //create and view Loding cube
    var run = function(){
        var dfd = $.Deferred();
        var userCollection= new UserCollection();
        lodingView = new LodingView({model:userCollection});
        userCollection.fetch().done(function(){
            LOG.debug("USER_LIST SELECT SUCCESS.");
            lodingView.render();
            dfd.resolve();
        }).fail(function(){
            LOG.debug("USER_LIST SELECT FAIL.");
            dfd.reject();
        });
        return dfd.promise();
    };
    //destory and Loding cube
    var stop = function(){
        lodingView.remove();      
    };
    return { 
        run:run,
        stop:stop
    };
});