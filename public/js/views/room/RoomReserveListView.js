define([
  'jquery',
  'underscore',
  'core/BaseView',
  'grid',
  'schemas',
  'i18n!nls/common',
  'util',
  'dialog',
  'cmoment',
  'code',
  'i18n!nls/common',
  'models/sm/SessionModel',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/row.html',
  'text!templates/default/rowdatepickerRange.html',
  'text!templates/default/rowbuttoncontainer.html',
  'text!templates/default/rowbutton.html',
  'models/room/RoomRegModel',
  'collection/room/RoomCollection',
  'collection/room/RoomRegCollection',
  'views/room/popup/EditRoomRegPopupView',
], function ($, _, BaseView, Grid, Schemas, i18Common, Util, Dialog, Moment, Code, i18nCommon, SessionModel,
  HeadHTML, ContentHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, RoomRegModel,
  RoomCollection, RoomRegCollection, EditRoomRegPopupView) {
    var RawDataView = BaseView.extend({
      el: $(".main-container"),

      initialize: function () {
        var _this = this;

        $(this.el).html('');
        $(this.el).empty();

        this.roomRegCollection = new RoomRegCollection();
        this.roomCollection = new RoomCollection();
        this.roomCollection.fetch();

        this.gridOption = {
          el: "roomRegDataContent",
          id: "roomRegDataTable",
          column: [
            { data: "index", "title": "예약번호" },
            { data: "date", "title": "예약일" },
            { data: "start_time", "title": "시작 시간", visible: false },
            { data: "end_time", "title": "종료 시간", visible: false },

            {
              data: "start_end_time", "title": "시간", render: function (data, display, rowData) {
                return rowData.start_time.substring(0, 5) + " ~ " + rowData.end_time.substring(0, 5);
              }
            },

            { data: "room_name", "title": "회의실" },
            { data: "title", "title": "제목" },
            { data: "user_name", "title": "예약자 이름" },

            { data: "attendance_list", "title": "참석자", visible: false },
            { data: "room_index", visible: false },
            { data: "member_id", visible: false },
            { data: "description", "title": "메모", visible: false},
          ],
          collection: this.roomRegCollection,
          detail: true,
          fetch: false,
          order: [[1, "desc"]]
        };

        var _buttons = ["search"];
        _buttons.push({
          type: "custom",
          name: "add",
          tooltip: "회의실 예약",
          click: function () {

            var editRoomRegPopupView = new EditRoomRegPopupView();
            Dialog.show({
              title: '회의실 예약',
              content: editRoomRegPopupView,
              buttons:
                [{
                  label: i18Common.DIALOG.BUTTON.ADD,
                  cssClass: Dialog.CssClass.SUCCESS,
                  action: function (dialogRef) {// 버튼 클릭 이벤트
                    editRoomRegPopupView.onClickBtnReg().done(function () {
                      dialogRef.close();
                      _this.getRoomRegData();

                      editRoomRegPopupView.closeModal();
                    });
                  }
                }, {
                  label: i18Common.DIALOG.BUTTON.CLOSE,
                  action: function (dialogRef) {
                    editRoomRegPopupView.closeModal();
                    dialogRef.close();
                  }
                }]
            });
          }
        });

        _buttons.push({
          type: "custom",
          name: "edit",
          tooltip: "예약 수정",
          click: function (_grid) {
            var selectItem = _grid.getSelectItem();
            if (_.isUndefined(selectItem)) {
              Dialog.warning(i18Common.GRID.MSG.NOT_SELECT_ROW);
            } else {
              var editRoomRegPopupView = new EditRoomRegPopupView();
              var roomRegModel = new RoomRegModel();
              roomRegModel.set( 
                {
                  index: selectItem.index,
                  room_index: selectItem.room_index,
                  member_id: selectItem.member_id,
                  user_name: selectItem.user_name,
                  title: selectItem.title,
                  date: selectItem.date,
                  start_time: selectItem.start_time,
                  end_time: selectItem.end_time,
                  description: selectItem.description,
                  attendance_list: selectItem.attendance_list
              });
                
              editRoomRegPopupView.setData(roomRegModel);

              var buttonList = [];
              if (roomRegModel.get('member_id') === SessionModel.getUserInfo().id) {
                buttonList =
                  [{
                    label: "회의 취소",
                    cssClass: Dialog.CssClass.SUCCESS,
                    action: function (dialogRef) {// 버튼 클릭 이벤트
                      editRoomRegPopupView.onClickBtnDel().done(function () {
                        dialogRef.close();
                        _this.getRoomRegData();
                      });
                    }
                  }, {
                    label: i18Common.DIALOG.BUTTON.SAVE,
                    cssClass: Dialog.CssClass.SUCCESS,
                    action: function (dialogRef) {// 버튼 클릭 이벤트
                      editRoomRegPopupView.onClickBtnReg().done(function () {
                        dialogRef.close();
                        _this.getRoomRegData();
                      });
                    }
                  }, {
                    label: i18Common.DIALOG.BUTTON.CLOSE,
                    action: function (dialogRef) {
                      dialogRef.close();
                    }
                  }];
              } else {
                buttonList =
                  [{
                    label: i18Common.DIALOG.BUTTON.CLOSE,
                    action: function (dialogRef) {
                      dialogRef.close();
                    }
                  }];
              }

              Dialog.show({
                title: '회의실 조회/수정',
                content: editRoomRegPopupView,
                buttons: buttonList
              });
            }
          }
        });

        this.gridOption.buttons = _buttons
      },

      render: function () {
        var _view = this;
        var _headSchema = Schemas.getSchema('headTemp');
        var _headTemp = _.template(HeadHTML);
        var _layout = $(LayoutHTML);
        var _head = $(_headTemp(_headSchema.getDefault({ title: "회의실", subTitle: "조회 / 예약" })));

        _head.addClass("no-margin");
        _head.addClass("relative-layout");

        var _content = $(ContentHTML).attr("id", this.gridOption.el);
        var _row = $(RowHTML);
        var _datepickerRange = $(_.template(DatePickerHTML)(
          {
            obj: {
              fromId: "rdFromDatePicker",
              toId: "rdToDatePicker"
            }
          })
        );

        var _btnContainer = $(_.template(RowButtonContainerHTML)({
          obj: {
            id: "rdBtnContainer"
          }
        }));

        var _searchBtn = $(_.template(RowButtonHTML)({
          obj: {
            id: "rdSearchBtn",
            label: i18nCommon.RAW_DATA_LIST.SEARCH_BTN
          }
        }));

        _btnContainer.append(_searchBtn);
        _row.append(_datepickerRange);
        _row.append(_btnContainer);

        // 주 / 월 / 리스트 선택 버튼
        var html = '<a href="#roomreservelist"><button class="btn btn-default btn-success float-right left-margin-5 selected-button" style="margin-right: 15px;">리스트</button></a>' +
          '<a href="#roomreservemonth"><button class="btn btn-default btn-success float-right left-margin-5">월</button></a>' +
          '<a href="#roomreserveweek"><button class="btn btn-default btn-success float-right left-margin-5">주</button></a>';
        _row.append(html);

        _layout.append(_head);
        _layout.append(_row);
        _layout.append(_content);

        $(this.el).append(_layout);

        var today = new Date();
        $(this.el).find("#rdFromDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          defaultDate: Moment(today).add(-60, "days").format("YYYY-MM-DD")
        });

        $(this.el).find("#rdToDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          defaultDate: Moment(today).add(60, "days").format("YYYY-MM-DD")
        });

        var _gridSchema = Schemas.getSchema('grid');

        this.grid = new Grid(_gridSchema.getDefault(this.gridOption));
        this.grid.render();
        if (Util.isNotNull(this.searchParam)) { // URL로 이동한 경우  셋팅된 검색 조건이 있을 경우 
          $(this.el).find("#rdFromDatePicker").data("DateTimePicker").setDate(this.searchParam.date);
          $(this.el).find("#rdToDatePicker").data("DateTimePicker").setDate(this.searchParam.date);
        }
        this.selectInOut();

        return this;
      },

      getRoomRegData: function () {
        var startDate = Moment($(this.el).find("#rdFromDatePicker").data("DateTimePicker").getDate().toDate());
        var endDate = Moment($(this.el).find("#rdToDatePicker").data("DateTimePicker").getDate().toDate());

        if (endDate.diff(startDate, 'days') > 365) {
          Dialog.warning("검색 기간이 초과되었습니다. (최대 365일)");
        } else {
          this.renderTable(startDate, endDate);
        }
      },
      renderTable: function (startDate, endDate) {
        var _this = this;
        Dialog.loading({
          action: function () {
            var dfd = new $.Deferred();
            _this.roomRegCollection.fetch({
              data: { start_date: startDate.format("YYYY-MM-DD"), end_date: endDate.format("YYYY-MM-DD") },
              success: function () {
                dfd.resolve();
              }, error: function () {
                dfd.reject();
              }
            });
            return dfd.promise();
          },

          actionCallBack: function (res) {//response schema
            _this.grid.render();
          },
          errorCallBack: function (response) {
            Dialog.error(i18nCommon.RAW_DATA_LIST.MSG.LOADING_FAIL);
          },
        });
      },
      events: {
        'click #rdSearchBtn': 'onClickSearchBtn'
      },
      
      onClickSearchBtn: function () {
        this.selectInOut();
      },
      getSearchForm: function () {	// 검색 조건
        var data = {
          start_date: $(this.el).find("#rdFromDatePicker").data("DateTimePicker").getDate().format("YYYY-MM-DD"),
          end_date: $(this.el).find("#rdToDatePicker").data("DateTimePicker").getDate().format("YYYY-MM-DD")
        }

        if (Util.isNull(data.start_date)) {
          alert("검색 시작 날짜를 선택해주세요");
          return null;
        } else if (Util.isNull(data.end_date)) {
          alert("검색 끝 날짜를 선택해주세요");
          return null;
        }

        return data;
      },
      selectInOut: function () {	// 데이터 조회
        var data = this.getSearchForm();
        if (Util.isNull(data)) {
          return;
        }

        var _this = this;
        this.roomRegCollection.fetch({
          data: data,
          success: function (result) {
            _this.grid.render();
          },
          error: function (result) {
            alert("데이터 조회가 실패했습니다.");
          }
        });
      }

    });
    return RawDataView;
  });
