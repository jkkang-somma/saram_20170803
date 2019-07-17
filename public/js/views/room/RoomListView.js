define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'lodingButton',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'models/sm/SessionModel',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'collection/room/RoomCollection',
  'views/room/popup/RoomDialogView',
  'models/room/RoomModel'
], function ($, _, Backbone, BaseView, Grid, LodingButton, Schemas, i18Common, Dialog, SessionModel, HeadHTML, ContentHTML, LayoutHTML, RoomCollection, RoomDialogView, RoomModel) {

  var RoomListView = BaseView.extend({
    el: ".main-container",
    initialize: function () {
      var roomCollection = new RoomCollection();
      this.gridOption = {
        el: "roomDataTable_content",
        id: "roomDataTable",
        column: [
          { "title": "코드", data: "index" },
          { "title": "이름", data: "name" },
          {
            "title": "사용",
            render: function (data, type, row) {
              var useVal = (row.use == 0) ? '미사용' : '사용';
              return useVal;
            }
          }
        ],
        collection: roomCollection,
        detail: true,
        order: [[1, "asc"]]
      };
    },

    events: {

    },

    render: function () {
      var _headSchema = Schemas.getSchema('headTemp');
      var _headTemp = _.template(HeadHTML);
      var _layOut = $(LayoutHTML);
      //Head 
      var _head = $(_headTemp(_headSchema.getDefault({ title: "회의실", subTitle: "회의실 관리" })));
      _head.addClass("no-margin");
      _head.addClass("relative-layout");

      //grid button add;
      var _buttons = ["search"];

      if (this.actionAuth.add) {
        _buttons.push({//ROOM Add
          type: "custom",
          name: "add",
          tooltip: "회의실 등록",
          click: function (_grid) {
            var addRoomDialogView = new RoomDialogView();
            Dialog.show({
              title: "회의실 추가",
              content: addRoomDialogView,
              buttons: [{
                label: i18Common.DIALOG.BUTTON.ADD,
                cssClass: Dialog.CssClass.SUCCESS,
                action: function (dialogRef) {// 버튼 클릭 이벤트
                  var _btn = this;
                  LodingButton.createSpin($(_btn).find(".spinIcon")[0]);
                  addRoomDialogView.submitAdd().done(function (data) {
                    _grid.addRow(data);
                    dialogRef.close();
                  });
                }
              }, {
                label: i18Common.DIALOG.BUTTON.CLOSE,
                action: function (dialogRef) {
                  dialogRef.close();
                }
              }]
            });
          }
        });
      }

      if (this.actionAuth.edit) {
        _buttons.push({//Room edit
          type: "custom",
          name: "edit",
          tooltip: "회의실 수정",
          click: function (_grid) {
            var selectItem = _grid.getSelectItem();
            if (_.isUndefined(selectItem)) {
              Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
            } else {
              var editRoomDialogView = new RoomDialogView(selectItem);
              Dialog.show({
                title: "회의실 수정",
                content: editRoomDialogView,
                buttons: [{
                  label: i18Common.DIALOG.BUTTON.SAVE,
                  cssClass: Dialog.CssClass.SUCCESS,
                  action: function (dialogRef) {// 버튼 클릭 이벤트
                    editRoomDialogView.submitEdit().done(function (data) {
                      _grid.updateRow(data);
                      dialogRef.close();
                    });//실패 따로 처리안함 add화면에서 처리.
                  }
                }, {
                  label: i18Common.DIALOG.BUTTON.CLOSE,
                  action: function (dialogRef) {
                    dialogRef.close();
                  }
                }]

              });
            }
          }
        });
      }

      //Refresh
      _buttons.push("refresh");
      this.gridOption.buttons = _buttons;

      //grid
      var _gridSchema = Schemas.getSchema('grid');
      new Grid(_gridSchema.getDefault(this.gridOption));
      var _content = $(ContentHTML).attr("id", this.gridOption.el);

      _layOut.append(_head);
      _layOut.append(_content);
      $(this.el).html(_layOut);
    }
  });

  return RoomListView;
});