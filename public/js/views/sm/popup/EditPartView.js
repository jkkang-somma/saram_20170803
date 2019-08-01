define([
  'jquery',
  'underscore',
  'underscore.string',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  'models/sm/PartModel',
  'code',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
  'collection/sm/UserCollection',
], function ($, _, _S, Backbone, BaseView, log, Dialog, i18nCommon, Form, PartModel, Code, CodeCollection, container, UserCollection) {
  var LOG = log.getLogger("EditPartView");
  var autocompleteId = "autocomplete";
  var availableTagsUser = [];
  var init_user;

  var EditPartView = BaseView.extend({
    initialize: function (data) {
      $(this.el).html('');
      $(this.el).empty();

      this.model = new PartModel(data);
      this.origin_code = data.code;
      this.origin_leader = data.leader;
      _.bindAll(this, "submitSave");
    },
    render: function (el) {
      var dfd = new $.Deferred();
      var _view = this;
      if (!_.isUndefined(el)) {
        this.el = el;
      }

      var _model = _view.model.attributes;
      if (_model.leader == null || _model.user_name == null) {
        init_user = "";
      }
      else {
        init_user = _model.user_name + "(" + _model.leader + ")";
      }
      var _form = new Form({
        el: _view.el,
        form: undefined,
        childs: [{
          type: "input",
          name: "code",
          label: i18nCommon.PART_LIST.CODE,
          value: _model.code,
        }, {
          type: "input",
          name: "name",
          label: i18nCommon.PART_LIST.NAME,
          value: _model.name,
        }, {
          //type:"input",
          type: "auto_input",
          name: "leader",
          id: autocompleteId,
          label: i18nCommon.PART_LIST.GRID_COL_NAME.LEADER,
          value: _model.leader,
        }, {
          type: "combo",
          name: "use",
          label: "사용여부",
          value: _model.use,
          collection: [{ key: 1, value: "사용" }, { key: 0, value: "사용 안함" }]
        }]
      });

      _form.render().done(function () {
        _view.form = _form;
        //dfd.resolve();
        dfd.resolve(_view);
      }).fail(function () {
        dfd.reject();
      });

      return dfd.promise();
    },
    afterRender: function () {
      $(document).ready(function () {
        var userCollection = new UserCollection();
        userCollection.fetch({
          success: function (result) {
            if (result.length > 1) {
              var userCnt = 0;
              for (var index = 0; index < result.models.length; index++) {
                if (_.isEmpty(result.models[index].attributes.leave_company) || result.models[index].attributes.leave_company == null) {
                  availableTagsUser[userCnt] = result.models[index].attributes.name + "(" + result.models[index].attributes.id + ")";
                  //console.log(availableTagsUser[userCnt]);
                  userCnt++;
                }
                else {
                  //console.log("Leave_company[" + result.models[index].attributes.name + "][" + result.models[index].attributes.leave_company + "]");
                }
              }
              // for( var index = 0; index < result.models.length; index++) {
              // 	availableTagsUser[index] = result.models[index].attributes.name + "(" + result.models[index].attributes.id + ")";
              // 	console.log(availableTagsUser[index]);
              // }
            }
            else {
              console.error("userCollection data is null!!!");
            }
          }
        })
        $("#autocomplete").autocomplete({
          source: availableTagsUser
        });
        $(".ui-autocomplete").css("position", "absolute");
        $(".ui-autocomplete").css("top", "100px");
        $(".ui-autocomplete").css("left", "100px");
        $(".ui-autocomplete").css("z-index", "2147483647");
        $(".ui-autocomplete").css("background", "#FFFFFF");

        $('#autocomplete').val(init_user);
      });
    },
    submitSave: function (e) {
      var dfd = new $.Deferred();
      var _view = this, _form = this.form, _data = _form.getData();

      if (!_view.checkFormData(_data)) {
        Dialog.warning("파트장을 바르게 입력하세요.");
        dfd.reject();
        return dfd;
      }

      var firstArr = (_data.leader).split("(");
      var strTemp = firstArr[1].split(")");
      _data.leader = strTemp[0];
      _data.user_name = firstArr[0];

      _data.origin_code = this.origin_code;
      var _partModel = new PartModel(_data);
      _partModel.attributes._code = "-2";

      _partModel.save({}, {
        success: function (model, xhr, options) {
          Code.init().then(function () {
            dfd.resolve(_data);
          });
          //dfd.resolve(_data);
        },
        error: function (model, xhr, options) {
          var respons = xhr.responseJSON;
          Dialog.error(respons.message);
          dfd.reject();
        },
        wait: false
      });

      return dfd.promise();
    },
    checkFormData: function (data) {
      // 파트장이 변경된 경우에만 정상성 체크
      if (availableTagsUser.indexOf(data.leader) >= 0) {
        return true
      }

      // 사번을 구함.
      if (data.leader.indexOf("(") === -1) {
        return false;
      }
      var firstArr = (data.leader).split("(");
      var strTemp = firstArr[1].split(")");
      var leader = strTemp[0];

      if (this.origin_leader === leader) {
        return true;
      }
      return false;
    },
  });
  return EditPartView;
});