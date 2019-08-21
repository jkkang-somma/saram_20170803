define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  'models/sm/DepartmentModel',
  'code',
  'collection/common/CodeCollection',
  'text!templates/default/input.html',
  'collection/sm/UserCollection',
], function ($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, DepartmentModel, Code, CodeCollection, container, UserCollection) {
  var LOG = log.getLogger("EditDepartmentView");
  var autocompleteId = "autocomplete";
  var availableTagsUser = [];
  var init_user;

  var EditDepartmentView = BaseView.extend({
    initialize: function (data) {
      $(this.el).html('');
      $(this.el).empty();

      this.origin_code = data.code;
      this.model = new DepartmentModel(data);
      _.bindAll(this, "submitSave");
    },
    render: function (el) {
      var dfd = new $.Deferred();
      var _view = this;
      var comboItem = [{ key: "", value: " " }];
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
          label: i18nCommon.DEPARTMENT_LIST.CODE,
          value: _model.code
        }, {
          type: "input",
          name: "name",
          label: i18nCommon.DEPARTMENT_LIST.NAME,
          value: _model.name,
        }, {
          type: "combo",
          name: "area",
          label: i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.AREA,
          value: _model.area,
          collection: [{ key: '서울', value: i18nCommon.AREA_LIST.AREA_1 }, { key: '수원', value: i18nCommon.AREA_LIST.AREA_2 }]
        }, {
          //type:"input",
          type: "auto_input",
          name: "leader",
          id: autocompleteId,
          label: i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.LEADER,
          value: _model.leader,

        }, {
          type: "combo",
          name: "use",
          label: i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.USE,
          value: _model.use,
          collection: [{ key: 1, value: i18nCommon.DEPARTMENT_LIST.UPDATE_DIALOG.USE_VALUE.USE }, { key: 0, value: i18nCommon.DEPARTMENT_LIST.UPDATE_DIALOG.USE_VALUE.NOT_USE }]
        }, {
          type: "empty_data",
          name: "user_name",
          label: i18nCommon.DEPARTMENT_LIST.GRID_COL_NAME.LEADER,
          value: _model.leader,
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
              console.log("userCollection data is null!!!");
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

      // 부서장 필수항목에서 선택항목으로 변경 - 2019.04.24 KJK
      // if(!_view.checkFormData(_data.leader)) {
      // 	Dialog.warning(i18nCommon.IPCONFIRM.IP.INVALID_USER);
      // 	dfd.reject();
      // 	return;
      // }

      if (_view.checkFormData(_data.leader)) {
        var firstArr = (_data.leader).split("(");
        var strTemp = firstArr[1].split(")");
        _data.leader = strTemp[0];
        _data.user_name = firstArr[0];
      } else {
        _data.leader = undefined;
      }
      _data.origin_code = this.origin_code;

      var _departmentModel = new DepartmentModel(_data);
      _departmentModel.attributes._code = "-2";

      _departmentModel.save({}, {
        success: function (model, xhr, options) {
          Code.init().then(function () {
            if (_data.leader === undefined) {
              _data.leader = "";
              _data.user_name = null;
            }
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
      if (availableTagsUser.indexOf(data) == -1) {
        return false;
      }
      return true;
    },
  });
  return EditDepartmentView;
});