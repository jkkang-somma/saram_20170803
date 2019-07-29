// 각 View 마다 동일한 변수나 function 이 있을경우 이곳에 추가하여 사용
// 각 View는 BaseView 를 상속 하여 생성한다.
define([
  'underscore',
  'backbone',
  'animator',
  'text!templates/loadingTemplate.html',
  'text!templates/cubeTemplate.html',
], function (_, Backbone, animator, LoadingHTML, CubeHTML) {

  var BaseView = Backbone.View.extend({
    beforeRender: function () {
      $(".loading-container").append(CubeHTML);
      $(".loading-container").append(LoadingHTML);
      $(".loading-container").css({ background: "white" });
      $(".loading-container").fadeIn();
    },
    affterRender: function () {
      $(".loading-container").fadeOut();
      $(".loading-container").removeData().unbind();
      $(".loading-container").html('');
    },
    close: function () {
      var view = this;
      view.undelegateEvents();
      view.$el.removeData();
      this.beforeDestroy(); // 2019.07.26 el 제거되기 전에 호출
      view.$el.empty();

      this.destroy();
    },
    destroy: function () {
      // 상속 후  개별 초기화 할 내용들 
    },
    beforeDestroy: function () {
    },
    setActionAuth: function (actionAuth) {
      this.actionAuth = actionAuth;
    }
  });

  return BaseView;

});