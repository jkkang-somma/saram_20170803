// 기본 Router, backbone router가 url(혹은 hashtag)에 따라 routing 전과 후에
// 필요한 작업을 추가 할 수 있도록 before, after가 추가됨
define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var BaseRouter = Backbone.Router.extend({
      before: function(){},
      after: function(){},
      route : function(route, name, callback){
          if (!_.isRegExp(route)) route = this._routeToRegExp(route);
          if (_.isFunction(name)) {
              callback = name;
              name = '';
          }
          if (!callback) callback = this[name];

          var router = this;

          Backbone.history.route(route, function(fragment) {
              var args = router._extractParameters(route, fragment);

              var next = function(){
                  callback && callback.apply(router, args);
                  router.trigger.apply(router, ['route:' + name].concat(args));
                  router.trigger('route', name, args);
                  Backbone.history.trigger('route', router, name, args);
                  router.after.apply(router, args);        
              }
              router.before.apply(router, [args, next]);
          });
          return this;
      }
  });

  return BaseRouter;
});