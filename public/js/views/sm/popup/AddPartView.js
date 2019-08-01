define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'lib/component/form',
  'code',
  'models/sm/PartModel',
  'collection/common/CodeCollection',
  'datatables',
  'collection/sm/UserCollection',
], function ($, _, Backbone, BaseView, log, Dialog, i18nCommon, Form, Code, PartModel, CodeCollection, Datatables, UserCollection) {
  var LOG = log.getLogger("AddPartView");
  var autocompleteId = "autocomplete";
  var availableTagsUser = [];

  var AddPartView = BaseView.extend({
    initialize: function () {
      $(this.el).html('');
      $(this.el).empty();

      this.model = new PartModel();
      _.bindAll(this, "submitAdd");
    },
    render: function (el) {
      var dfd = new $.Deferred();
      var _view = this;
      var comboItem = [{ key: "", value: " " }];
      if (!_.isUndefined(el)) {
        this.el = el;
      }

      var _model = _view.model.attributes;
      var _form = new Form({
        el: _view.el,
        form: undefined,
        childs: [{
          type: "input",
          name: "code",
          label: i18nCommon.PART_LIST.GRID_COL_NAME.CODE,
          value: _model.code,
        }, {
          type: "input",
          name: "name",
          label: i18nCommon.PART_LIST.GRID_COL_NAME.NAME,
          value: _model.name,
        }, {
          //type:"input",
          type: "auto_input",
          name: "leader",
          label: i18nCommon.PART_LIST.GRID_COL_NAME.LEADER,
          value: _model.leader,
          id: autocompleteId
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
      });
    },
    submitAdd: function () {
      var view = this;
      var dfd = new $.Deferred();
      var _view = this, _form = this.form, _data = _form.getData();
      if (!view.checkFormData(_data.leader)) {
        Dialog.warning(i18nCommon.IPCONFIRM.IP.INVALID_USER);
        dfd.reject();
        return;
      }
      var firstArr = (_data.leader).split("(");
      var strTemp = firstArr[1].split(")");
      _data.leader = strTemp[0];
      _data.user_name = firstArr[0];

      var _partModel = new PartModel(_data);

      _partModel.save({}, {
        success: function (model, xhr, options) {
          Code.init().then(
            function () {
              dfd.resolve(_.defaults(_data, _partModel.default));
            });
          //dfd.resolve(_.defaults(_data, _partModel.default));
        },
        error: function (model, xhr, options) {
          var respons = xhr.responseJSON;
          dfd.reject();
        },
        wait: false
      });

      dfd.resolve(_data);
      return dfd.promise();
    },
    checkFormData: function (data) {
      if (availableTagsUser.indexOf(data) == -1) {
        return false;
      }
      return true;
    },
    getFormData: function (form) {
      var unindexed_array = form.serializeArray();
      var indexed_array = {};

      $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
      });

      return indexed_array;
    }
  });
  return AddPartView;
});