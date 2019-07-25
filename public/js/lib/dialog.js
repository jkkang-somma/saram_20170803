// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'schemas',
  'bootstrap',
  'bootstrap-dialog',
  'log4javascript',
  'i18n!nls/common',
  'animator',
], function ($, _, Backbone, log, Schemas, Bootstrap, BootstrapDialog, log4javascript, i18nCommon, Animation) {
  var CssClass = {
    ERROR: "btn-danger",
    INFO: "btn-info",
    WARNING: "btn-warning",
    PRIMARY: "btn-primary",
    SUCCESS: "btn-success"
  }
  var _responseSchema = Schemas.getSchema('response');
  var LOG = log.getLogger("Dialog");
  var types = [BootstrapDialog.TYPE_DEFAULT,
  BootstrapDialog.TYPE_INFO,
  BootstrapDialog.TYPE_PRIMARY,
  BootstrapDialog.TYPE_SUCCESS,
  BootstrapDialog.TYPE_WARNING,
  BootstrapDialog.TYPE_DANGER];

  var movableEvnet = function() {
    $(".modal-header").on("mousedown", function(mousedownEvt) {
      var $draggable = $(this);
      var x = mousedownEvt.pageX - $draggable.offset().left,
          y = mousedownEvt.pageY - $draggable.offset().top;
      $("body").on("mousemove.draggable", function(mousemoveEvt) {
        $draggable.closest(".modal-dialog").offset({
            "left": mousemoveEvt.pageX - x - 10,
            "top": mousemoveEvt.pageY - y - 30
        });
      });
      $("body").one("mouseup", function() {
          $("body").off("mousemove.draggable");

          // 모바일에서 스크롤이 되지 않는 이유로 기능 추가 KJK 2019-07-26
          // 제거할 경우 .modal { 와 함께 제거해야 함.
          var $modalDialg = $($(".modal-dialog")[0]);
          var topValue = $modalDialg.css("top").replace("px", "");
          // 아래로 계속 내려가는 현상 막기
          if (topValue >= 900) {
            $modalDialg.css("top", "899px");
            return;
          }
      });
      $draggable.closest(".modal").one("bs.modal.hide", function() {
          $("body").off("mousemove.draggable");
      });
    });
  }

  var error = function (msg, callback) {//ERROR
    BootstrapDialog.show({
      title: i18nCommon.DIALOG.TITLE.ERROR,
      message: msg,
      type: BootstrapDialog.TYPE_DANGER,
      closable: true,
      buttons: [{
        label: i18nCommon.DIALOG.BUTTON.CLOSE,
        cssClass: CssClass.ERROR,
        action: function (dialogRef) {
          dialogRef.close();
          if (!_.isUndefined(callback)) {
            callback();
          }
        }
      }],
      onshown: function() {movableEvnet();}
    });
  }
  var warning = function (msg, callback) {//WARNING
    BootstrapDialog.show({
      title: i18nCommon.DIALOG.TITLE.WARNING,
      message: msg,
      type: BootstrapDialog.TYPE_WARNING,
      closable: true,
      buttons: [{
        label: i18nCommon.DIALOG.BUTTON.CLOSE,
        cssClass: CssClass.WARNING,
        action: function (dialogRef) {
          dialogRef.close();
          if (!_.isUndefined(callback)) {
            callback();
          }
        }
      }],
      onshown: function() {movableEvnet();}
    });
  }

  var info = function (msg, callback) {//INFO 팝업
    BootstrapDialog.show({
      title: i18nCommon.DIALOG.TITLE.INFO,
      message: msg,
      type: BootstrapDialog.TYPE_DEFAULT,
      closable: true,
      buttons: [{
        label: i18nCommon.DIALOG.BUTTON.CLOSE,
        cssClass: CssClass.SUCCESS,
        action: function (dialogRef) {
          dialogRef.close();
          if (!_.isUndefined(callback)) {
            callback();
          }
        }
      }],
      onshown: function() {movableEvnet();}
    });
  }

  var show = function (msg, callback) {
    if (_.isUndefined(msg)) {
      LOG.debug("MSG is Undefined.");
      return;
    }

    if (_.isString(msg)) {//단순 메세지 팝업
      info(msg, callback);
    } else if (_.isObject(msg)) {
      //msg 설정된 내용을 기본 옵션에 오버라이드 한다.

      var _container = $("<div class='container' ></div>");
      if (!_.isUndefined(msg.content)) {//화면이 있다면 container 해당하는 화면을 출력한다. view의 render는 promise 패턴 구현.
        var _content = msg.content;
        _content.render(_container).done(function (resultView) {
          var dialogOption = _.defaults(msg, {
            title: i18nCommon.DIALOG.TITLE.DEFAULT,
            message: _container,
            type: BootstrapDialog.TYPE_DEFAULT,
            //cssClass:CssClass.DEFAULT,
            closable: false,
            buttons: [],
            size: BootstrapDialog.SIZE_NORMAL
          });
          if (!_.isUndefined(resultView) && !_.isUndefined(resultView.afterRender)) {
            dialogOption.onshown = function () {
              movableEvnet();
              resultView.afterRender();
            };
          } else {
            dialogOption.onshown = function () {
              movableEvnet();
            };
          }

          BootstrapDialog.show(dialogOption);
        });
      } else {
        var dialogOption = _.defaults(msg, {
          title: i18nCommon.DIALOG.TITLE.DEFAULT,
          message: _container,
          type: BootstrapDialog.TYPE_DEFAULT,
          //cssClass:CssClass.DEFAULT,
          closable: false,
          buttons: []
        });

        dialogOption.onshown = function () {
          movableEvnet();
        };

        BootstrapDialog.show(dialogOption);
      }
    }
  }
  var confirm = function (config) {//질의형 팝업
    var _btns = _.initial([]);
    if (_.isArray(config.buttons)) {// 커스텀 버튼 그룹이 있으면 셋팅. 버튼 배열
      _btns = config.buttons;
    } else {
      if (!(_.isUndefined(config.buttons) || _.isNull(config.buttons))) {//버튼 Object 지원
        _btns.push(config.buttons);
      } else {// Default 버튼
        _btns = [{
          label: i18nCommon.DIALOG.BUTTON.OK,
          cssClass: CssClass.INFO,
          //autospin: true,
          closable: false,
          action: function (dialogRef) {// 버튼 클릭 이벤트
            var _box = $("<div class='dialog-loding'></div>");
            dialogRef.getModalBody().html(_box);
            Animation.animate('.dialog-loding', Animation.FADE_IN);

            dialogRef.enableButtons(false);
            dialogRef.setClosable(false);
            //dialogRef.getModalBody().html('Delete.......');
            if (_.isUndefined(config.action) || (!_.isFunction(config.action))) {
              setTimeout(function () {
                dialogRef.close();
              }, 1000);

            } else {
              config.action().done(function (e) {
                var res = _responseSchema.getDefault(e);
                Animation.animate('.dialog-loding', Animation.FADE_OUT);
                if (!_.isNull(res.msg)) {
                  dialogRef.getModalBody().html(res.msg);
                }

                if ((!_.isUndefined(config.actionCallBack)) && _.isFunction(config.actionCallBack)) {
                  //validation 체크, 콜백 함수가 정의 되어있다면 해당 함수 호출
                  var callbackFn = config.actionCallBack;
                  callbackFn(res);
                }
                dialogRef.close();
              }).fail(function (e) {//에러 처리.
                var response = _responseSchema.getDefault(e);
                if ((!_.isUndefined(config.errorCallBack)) && _.isFunction(config.errorCallBack)) {
                  //validation 체크, 콜백 함수가 정의 되어있다면 해당 함수 호출
                  var callbackFn = config.errorCallBack;
                  callbackFn(response);
                }
                dialogRef.close();
                error(response.msg);
              })
            }
          }
        }, {
          label: i18nCommon.DIALOG.BUTTON.CLOSE,
          action: function (dialogRef) {
            dialogRef.close();
          }
        }]
      }
    }

    BootstrapDialog.show({
      title: i18nCommon.DIALOG.TITLE.PRIMARY,
      message: config.msg,
      type: BootstrapDialog.TYPE_PRIMARY,
      closable: true,
      buttons: _btns,
      onshown: function() {movableEvnet();}
    });
  };

  var loading = function (config) {//질의형 팝업
    BootstrapDialog.show({
      title: "Loading",
      type: BootstrapDialog.TYPE_PRIMARY,
      closable: false,
      message: $("<div class='dialog-loding'></div>"),

      onshown: function (dialogRef) {
        movableEvnet();
        Animation.animate('.dialog-loding', Animation.FADE_IN);

        config.action().done(function (e) {
          var res = _responseSchema.getDefault(e);
          Animation.animate('.dialog-loding', Animation.FADE_OUT);
          if (!_.isNull(res.msg)) {
            dialogRef.getModalBody().html(res.msg);
          }

          if ((!_.isUndefined(config.actionCallBack)) && _.isFunction(config.actionCallBack)) {
            //validation 체크, 콜백 함수가 정의 되어있다면 해당 함수 호출
            var callbackFn = config.actionCallBack;
            callbackFn(res);
          }
          dialogRef.close();
        }).fail(function (e) {//에러 처리.
          var response = _responseSchema.getDefault(e);
          if ((!_.isUndefined(config.errorCallBack)) && _.isFunction(config.errorCallBack)) {
            //validation 체크, 콜백 함수가 정의 되어있다면 해당 함수 호출
            var callbackFn = config.errorCallBack;
            callbackFn(response);
          }
          dialogRef.close();
          error(response.msg);
        });
      }

    });
  };


  return {
    info: info,
    error: error,
    show: show,
    warning: warning,
    confirm: confirm,
    loading: loading,
    CssClass: CssClass
  }
});