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
  'models/room/RoomModel'
], function ($, _, _S, Backbone, BaseView, log, Dialog, i18nCommon, Form, RoomModel) {
  var LOG = log.getLogger("RoomDialogView");

  var mode = "ADD";
  var RoomDialogView = BaseView.extend({
    initialize: function (data) {
      if (data) {
        mode = "EDT";
        this.model = new RoomModel(data);
      } else {
        mode = "ADD";
        this.model=new RoomModel();
      }
      
      _.bindAll(this, "submitEdit");
    },
    render: function (el) {
      var dfd = new $.Deferred();
      var _this = this;

      if (!_.isUndefined(el)){
				_this.el=el;
			}

      var _model = _this.model.attributes;

      var _form = new Form({
        el: _this.el,
        form: undefined
      });

      _form.childs = [];

      if (mode === "EDT") {
        _form.childs.push({
          type: "input",
          name: "index",
          label: "코드",
          value: _model.index,
          disabled: mode === "EDT"
        })
      }

      _form.childs.push({
        type: "input",
        name: "name",
        label: "이름",
        value: _model.name,
      });

      _form.childs.push({
        type: "combo",
        name: "use",
        label: "사용",
        value: _model.use,
        collection: [{ key: 1, value: i18nCommon.DEPARTMENT_LIST.UPDATE_DIALOG.USE_VALUE.USE }, { key: 0, value: i18nCommon.DEPARTMENT_LIST.UPDATE_DIALOG.USE_VALUE.NOT_USE }]
      });

      _form.render().done(function () {
        _this.form = _form;
        dfd.resolve(_this);
      }).fail(function () {
        dfd.reject();
      });

      return dfd.promise();
    },
    submitAdd: function (e) {
      var view = this;
			var dfd= new $.Deferred();
			var _this=this, _form=this.form, _data=_form.getData();

      if (!this.checkFormData(_data)) {
        Dialog.warning("데이터를 입력하세요.");
        return;
      }

      var _roomModel=new RoomModel(_data);

			_roomModel.save({},{
				success:function(model, xhr, options){
          _data.index = model.get("index")
          var t = _.defaults(_data, _roomModel.default)
					dfd.resolve(_.defaults(_data, _roomModel.default));
				},
				error:function(model, xhr, options){
          var respons=xhr.responseJSON;
          Dialog.error(respons.message);
					dfd.reject();
				},
				wait:false
			});
			return dfd.promise();
    },
    submitEdit: function (e) {
      var dfd = new $.Deferred();
      var _this = this, _form = this.form, _data = _form.getData();

      if (!this.checkFormData(_data)) {
        Dialog.warning("데이터를 입력하세요.");
        return;
      }
      var _roomModel = new RoomModel(_data);

      _roomModel.save({}, {
        success: function (model, xhr, options) {
          dfd.resolve(_data);
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
      if (mode === "EDT") {
        if (data.index < 0 ) {
          return false;
        }
        data.index = Number(data.index);
      }
      if (data.name.length > 1) {
        return true;
      }
      return false;
    },
  });
  return RoomDialogView;
});