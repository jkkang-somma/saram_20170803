define([
  'jquery',
  'underscore',
  'backbone',
  'cmoment',
  'util',
  'core/BaseView',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'models/sm/SessionModel',
  'text!templates/default/head.html',
  'text!templates/room/roomReserve.html',
  'text!templates/room/roomReserveMonthContent.html',
  'views/room/popup/EditRoomRegPopupView',
  'models/room/RoomModel',
  'collection/room/RoomCollection',
  'collection/room/RoomRegCollection',
  'views/room/MonthCalendarView'

], function (
  $, _, Backbone, Moment, Util,
  BaseView,
  Schemas,
  i18Common,
  Dialog,
  SessionModel,
  HeadHTML,
  contentHTML,
  RoomContentHTML,
  EditRoomRegPopupView,
  RoomModel,
  RoomCollection,
  RoomRegCollection,
  MonthCalendarView
) {

    var _defaultData = {
      id: "",
      name: "",
    };
    var currentDisplay_Month;

    var RoomReserveView = BaseView.extend({
      el: ".main-container",
      elements: {
        _roomData: [],
        _regDataOrigin: [],
        _regDataByDate: [],
        _isShowPopup: 0, // 0: none , 1: ignore, 2: display
        _startDate: "",
        _endDate: "",
      },

      initialize: function () {
        //초기 검색 조건 설정 이번달. 1일 부터 말일까지.
        _defaultData.id = SessionModel.getUserInfo().id;
        _defaultData.name = SessionModel.getUserInfo().name;

        var startDate = Moment().startOf('month').format("YYYY-MM-DD");
        var endDate = Moment().endOf('month').format("YYYY-MM-DD HH:mm:ss");
        var searchParams = {
          start: startDate,
          end: endDate,
          id: _defaultData.id
        };

        this.searchParams = searchParams;
      },

      destroy: function () {
        this.calendarView.destroy();
      },

      events: {
        'click #roomRegBtn': 'onClickRoomRegBtn',           // 회의실 예약
        'click #room_date_next': "onClickNextMonth",        // Next
        'click #room_date_prev': "onClickPrevMonth",        // Prev
        'click #room_data_refresh': "onClickRefresh",       // 갱신       
      },

      render: function () {
        // header
        var _headSchema = Schemas.getSchema('headTemp');
        var _headTemp = _.template(HeadHTML);
        var _contentHTML = $(contentHTML);
        var _head = $(_headTemp(_headSchema.getDefault({ title: "회의실", subTitle: "조회 / 예약" })));

        _head.addClass("no-margin");
        _head.addClass("relative-layout");

        var _contentBody = _.template(RoomContentHTML);

        _contentHTML.append(_head);
        _contentHTML.append(_contentBody);
        $(this.el).append(_contentHTML);

        var month_period_el = $(this.el).find("#month_period");
        var displayDate = Moment().startOf('month').format("YYYY-MM");
        month_period_el.text(displayDate);

        this.calendarView = new MonthCalendarView({el: $(this.el).find("#calendar")[0]});
        this.drawCalendar();
      },

      drawCalendar: function() {
        var _this = this;
        var month_period_el = $(this.el).find("#month_period");
        var startDate = month_period_el.text() + "-01";

        var targetDate = new Date(startDate);
        var lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        var endDate = Moment(new Date(lastDay)).format("YYYY-MM-DD") + " 23:59:59";

        this.elements._startDate = startDate;
        this.elements._endDate = endDate;

        this.loadData().done(function() {
          _this.calendarView.draw({start: startDate});
          $(this.el).append(_this.calendarView);
        })
      },

      // 새로고침 클릭
      onClickRefresh: function () {
        this.drawCalendar();
      },

      // 다음달 클릭
      onClickNextMonth: function () {
        var month_period_el = $(this.el).find("#month_period");

        var start_date = month_period_el.text();
        var _displayDate = Moment(start_date, "YYYY-MM").add(1, "month").format("YYYY-MM");
        var today = new Date(_displayDate);
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        var fromDate = Moment(firstDay).format("YYYY-MM-DD");
        var toDate = Moment(new Date(lastDay)).format("YYYY-MM-DD");

        month_period_el.text(_displayDate);
        this.elements._startDate = fromDate;
        this.elements._endDate = toDate;
        currentDisplay_Month = _displayDate;
        // RELOAD 필요
        this.drawCalendar();
      },

      // 이전달 클릭
      onClickPrevMonth: function () {
        var month_period_el = $(this.el).find("#month_period");

        var start_date = month_period_el.text();
        var _displayDate = Moment(start_date, "YYYY-MM").add(-1, "month").format("YYYY-MM");
        var today = new Date(_displayDate);
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        var fromDate = Moment(firstDay).format("YYYY-MM-DD");
        var toDate = Moment(new Date(lastDay)).format("YYYY-MM-DD");

        month_period_el.text(_displayDate);
        this.elements._startDate = fromDate;
        this.elements._endDate = toDate;
        currentDisplay_Month = _displayDate;
        // RELOAD 필요
        this.drawCalendar();
      },

      loadData: function () {
        var dfd = new $.Deferred();
        var roomRegCol = new RoomRegCollection();
        var _this = this;

        var reqData = {
          start_date: this.elements._startDate,
          end_date: this.elements._endDate
        };

        roomRegCol.fetch({
          data: reqData,
          success: function (result) {
            _this.elements._regDataOrigin = result;
            _this.setData().done(function() {
              dfd.resolve();
            });
          },
          error: function(e) {
            Dialog.error("통신 실패");
          }
        });
        return dfd.promise();
      },

      getRoomInfo: function () {
        var dfd = new $.Deferred();
        var _this = this;
        var _roomColl = new RoomCollection();
        _roomColl.url = '/room';
        _roomColl.fetch({
          data: {},
          error: function (result) {
            dfd.reject();
          }
        }).done(function (result) {
          _this.elements._roomData = [];
          if (result.length > 0) {
            for (var i = 0; i < result.length; i++) {
              if (result[i].use !== '1') {
                continue;
              }
              var roomModel = new RoomModel();
              roomModel.index = result[i].index;
              roomModel.name = result[i].name;
              _this.elements._roomData.push(roomModel);
            }
          }
          dfd.resolve(result);
        });
        return dfd.promise();
      },

      setData: function () {
        var dfd = new $.Deferred();
        var _this = this;

        this.getRoomInfo().done(function (result) {
          // 출력할 모든 회의 데이터
          var regData = [];

          // 출력할 날짜/회의실 셋팅
          var PRINT_DAY_LIST = [];
          var PRINT_ROOM_LIST = _this.elements._roomData;
          var tmpDay = Moment(_this.elements._startDate);
          // var dayCount = 0; // 출력할 일수 
          for (var dayIndex = 0; tmpDay.format("YYYY-MM-DD") <= _this.elements._endDate; dayIndex++) {
            PRINT_DAY_LIST.push(tmpDay.format("YYYY-MM-DD"));
            regData[PRINT_DAY_LIST[dayIndex]] = [];
            regData.length++;
            for (var roomIndex = 0; roomIndex < PRINT_ROOM_LIST.length; roomIndex++) {
              regData[PRINT_DAY_LIST[dayIndex]][PRINT_ROOM_LIST[roomIndex].index] = [];
            }
            tmpDay.add(1, "days");
          }

          for (var regIndex = 0; regIndex < _this.elements._regDataOrigin.length; regIndex++) {
            // TODO 에러 발생 지점 체크 필요 _this.elements._regData.models === undefined
            var regModel = _this.elements._regDataOrigin.models[regIndex];
            if (regData[regModel.get("date")][regModel.get("room_index")]) {
              regData[regModel.get("date")][regModel.get("room_index")].push(regModel);
            }
          }

          _this.elements._regDataByDate = regData;
          _this.calendarView.SetRegData(_this, _this.elements._regDataByDate, _this.elements._roomData, PRINT_DAY_LIST);

          dfd.resolve();
        }).fail(function () {
          Dialog.error("회의실 데이터 조회를 실패했습니다.");
          dfd.reject();
        });

        return dfd.promise();
      },

      // 예약하기 - 회의실 예약 화면 출력
      onClickRoomRegBtn: function (date, room, hour) {
        var _this = this;
        var editRoomRegPopupView = new EditRoomRegPopupView(this, date, room, hour);
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
                  _this.onClickRefresh();
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
      },

      GetMonthDataString: function () {
        return currentDisplay_Month;
      },
    });
    return RoomReserveView;
  });