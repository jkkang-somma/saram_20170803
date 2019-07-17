/**
 * 2017.08.03. ~ 2017.08.25.. 
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'code',
  'cmoment',
  'util',
  'dialog',
  'models/sm/SessionModel',
  'collection/dashboard/AttendanceCollection',
  'collection/dashboard/CommuteSummaryCollection',
  'collection/common/HolidayCollection',
  'text!templates/calendarTemplateBase.html',
  'text!templates/room/calendarDayTemplate.html',
  'tool/d3_460/d3.min',
  'views/room/popup/EditRoomRegPopupView',
  'i18n!nls/common',
  'models/room/RoomModel',
  'collection/room/RoomCollection',
], function ($, _, Backbone, Code, Moment, Util, Dialog, SessionModel, AttendanceCollection, CommuteSummaryCollection, HolidayCollection,
  calendarHTML, calendarDayHTML, d3, EditRoomRegPopupView, i18Common, RoomModel, RoomCollection) {

    var _outputData = [];

    var MonthCalendarView = Backbone.View.extend({

      elements: {
        _roomData: [],
        _regData: [],
        _printDayList: [],
        _hourXList: [],
        _rowHeight: 30,
        _isShowPopup: 0, // 0: none , 1: ignore, 2: display
        _bindEvent1: undefined
      },
      initialize: function (opt) {
        this.$el = $(opt.el);
        this.commuteSummaryCollection = new CommuteSummaryCollection();
        this.attendanceCollection = new AttendanceCollection();
        this.holidayCollection = new HolidayCollection();
        this._today = new Moment().format("YYYY-MM-DD");

        this.elements._bindEvent1 = _.bind(this.resetPopupMenu, this);
        $(window).on("click", this.elements._bindEvent1);
      },

      destroy: function () {
        $(window).off("click", this.elements._bindEvent1);
      },

      events: {
        'click .reserve-data': "onClickCheckData",
        'click .reserve-area': "onClickShowPopup",
        'click #cal_room_reg_item': "onClickRoomRegPopup",
      },
      draw: function (params) {
        var _view = this;
        var yearData = new Moment(params.start);
        _view.getHolidaySummary({ year: yearData.year() }).done(function (result) { // 휴일 조회
          _view.holiday = result;
          _view.drawCalendar(params);
        }).fail(function () {
          Dialog.error("휴일 정보 조회 실패!");
        });
      },

      getCommuteSummary: function (params) {
        var _view = this;
        var dfd = new $.Deferred();
        this.commuteSummaryCollection.fetch({
          data: params,
          success: function (commuteSummaryCollection, result) {
            dfd.resolve(result);
          },
          error: function () {
            dfd.reject();
          }
        });
        return dfd.promise();
      },


      getHolidaySummary: function (params) {
        var _view = this;
        var dfd = new $.Deferred();
        this.holidayCollection.fetch({
          data: params,
          success: function (collection, result) {
            _view.overTimeDay = Util.getApprovalLimitDate(_view.holidayCollection)
            dfd.resolve(result);
          },
          error: function () {
            dfd.reject();
          }
        });
        return dfd.promise();
      },

      drawHoliday: function (selDate) {
        var _view = this;
        var thisMonth = new Moment(selDate);
        thisMonth = thisMonth.month();
        _.each(_view.holiday, function (dd) {
          var holDate = new Moment(dd.date);
          var holMonth = holDate.month();
          if (thisMonth == holMonth) {
            var holId = holDate.format("YYYY-MM-DD");
            var holCon = $(_view.el).find('#' + holId);
            holCon.removeClass('reserve-area');                 // 공휴일 / 추가 Holiday도 예약이 되는 경우가 있어 클래스 이름을 직접 'holiday'로 교체한다.
            holCon.addClass('holiday');

            // cc-header
            holCon.find('.cc-header').append('<span>' + dd.memo + '</span>')
          }
        });
      },

      drawCalendar: function (params) {
        var _view = this;
        var year = params.start.split("-")[0];
        var month = params.start.split("-")[1] - 1;
        // 현재 달의 1일의 요일
        var theDate = new Date(year, month);
        var startDayOfWeek = theDate.getDay();
        var lastDay = new Date(year, month + 1, 0).getDate();
        var row = Math.ceil((startDayOfWeek + lastDay) / 7);
        var data = [];
        var reserveDisplay = [];
        var attributes = [];
        var tmpDay;
        var closeTag = "</div>";
        var exist = true;
        var colorList = d3.schemeCategory20;

        // 데이터 출력          // nonoc   
        // if (_regData.length != 0) {
        {
          var roomData = _roomData;
          var regData = _regData;

          var room_cnt = roomData.length;
          var day_cnt = regData.length;
          var index;
          for (var dayIndex = 0; dayIndex < day_cnt; dayIndex++) {
            tmpDay = dayIndex + 1;
            reserveDisplay = [];
            attributes = [];
            openTag = "";
            exist = true;

            index = 0;
            var oneDay = _printDayList[dayIndex];
            for (var rIdx = 0; rIdx < room_cnt; rIdx++) {
              var roomIndex = roomData[rIdx].index;

              for (var regIndex = 0; regIndex < regData[oneDay][roomIndex].length; regIndex++) {
                var roomRegModel = regData[oneDay][roomIndex][regIndex];

                var titleText = roomRegModel.get("start_time") + " " + roomRegModel.get("title");
                var tooltip = Util.makeRoomRegTooltip(roomRegModel);

                // 컬러 반영하여 달력에 출력
                var color = colorList[(rIdx*2)+1];
                var reserveDisplayHtml = "<div value = " + index + " class ='reserve-data' style= 'background-color:" + color + "' title='" +tooltip+ "'>" + titleText + closeTag;
                
                reserveDisplay[index] = {html: reserveDisplayHtml, start_time: roomRegModel.get("start_time")};
                attributes[index] = roomRegModel;
                index++;
              }
            }
            var pushData = {
              "days": tmpDay,
              "reserveDisplay": reserveDisplay,
              "attributes": attributes,
              "exist": exist
            };
            data.push(pushData);
            _outputData = data;
          }
        }

        this.$el.html(calendarHTML);
        var calBody = $(this.el).find("#calendar_body");
        var resultHtml = this.makeOneWeekHtml(row, startDayOfWeek, lastDay, year, month, data);
        calBody.append(resultHtml);

        var todayBox = $(this.el).find("#" + this._today);
        if (todayBox.length > 0) {
          todayBox.css('border', '2px solid #34495e');
        }
        var holiday = $('.holiday');
        var bgColor1 = $('.cc-header').eq(0).css("background-color");
        var bgColor2 = $('.cc-header').eq(6).css("background-color");
        var textColor = $('.cc-header').eq(0).css("color")
        var target;
        for (var k = 0, len = holiday.length; k < len; k++) {
          target = $('.holiday').parent().parent().parent().find('.cc-header').eq(k);
          if (bgColor1 !== target.css("background-color") && bgColor2 !== target.css("background-color")) {
            target.css("background-color", bgColor1);
            target.css("color", textColor);
          }
        }
        _view.drawHoliday(params.start);
      },

      makeOneWeekHtml: function (row, startDayOfWeek, lastDay, year, month, data) {
        var calBody = $(this.el).find("#calendar_body");

        var day = 0;
        for (var i = 1; i <= row; i++) {
          var rowHtml = "<tr>";
          var rowTemplate = {}
          for (var j = 1; j <= 7; j++) {
            var obj = {
              date: '', 
              day : '',
              className: '',
              roomRegList: ''
            };
            
            if (i == 1 && j <= startDayOfWeek) {
              // 1일 시작 전
              rowTemplate = _.template(calendarDayHTML)(obj);
            } else if (_.isUndefined(data[day])) {
              // 말일 종료 후
              rowTemplate = _.template(calendarDayHTML)(obj);
            } else {

              // 1일 ~ 말일까지
              var tmpDay = Moment(year + '-' + (month + 1) + '-' + data[day].days);
              obj.date = tmpDay.format('YYYY-MM-DD');
              obj.day = data[day].days;
              obj.className = '';

              if (j == 7) {
                // 토요일
                obj.className = "saturday";
              } else if (j == 1) {
                // 쉬는 날
                obj.className = "holiday";
              } else {
                obj.className = "reserve-area";
              }
              
              if (data[day].reserveDisplay) {
                // 시간 순서로 소팅하여 출력
                var sortedRD = _.sortBy(data[day].reserveDisplay, 'start_time');
                for (var rd of sortedRD) {
                  obj.roomRegList += rd.html;
                }
              }

              rowTemplate = _.template(calendarDayHTML)(obj);
              
              day++;
            }
            rowHtml += rowTemplate;
          }
          rowHtml += "</tr>";
          calBody.append(rowHtml);
        }
      },

      getCommuteByDay: function (year, month, day) {
        var _view = this;
        var dateStr = year + "-";
        dateStr += (month < 9) ? "0" + (month + 1) + "-" : (month + 1) + "-";
        dateStr += (day < 9) ? "0" + (day + 1) : (day + 1);

        commuteData = _.select(_view.commuteSummary, function (com) {
          if (com.date == dateStr) {
            return com;
          }
        });
        return commuteData;
      },

      SetRegData: function (parm_parend_wnd, parm_data, room_data, print_day_list) {
        this.reserveView = parm_parend_wnd;
        _regData = parm_data;
        _roomData = room_data;
        _printDayList = print_day_list;

      },

      // 마우스로 클릭하여 예약하기 팝업메뉴 디스플레이
      onClickShowPopup: function (event) {
        var date = event.currentTarget.id;

        // 오늘 이전 날짜는 예약할 수 없음.
        if (Moment(new Date()).format("YYYY-MM-DD") > date) {
          return;
        }
        
        $($("#cal_room_reg_popup_menu")[0]).css("display", "block").css("top", event.pageY).css("left", event.pageX);
        $($("#cal_room_reg_item")[0]).attr("date", date);
        this.elements._isShowPopup = 1;
      },

      resetPopupMenu: function () {
        // 0: none , 1: ignore, 2: display
        if (this.elements._isShowPopup == 0 || this.elements._isShowPopup == 1) {
          this.elements._isShowPopup = 2;
          return;
        }

        $($("#cal_room_reg_popup_menu")[0]).css("display", "none");
        this.elements._isShowPopup = 0;
      },

      onClickRoomRegPopup: function (event) {
        $($("#cal_room_reg_popup_menu")[0]).css("display", "none");

        var target = $(event.target);

        // 오늘 이전 날짜는 예약할 수 없음.
        if (Moment(new Date()).format("YYYY-MM-DD") > target.attr('date')) {
          Dialog.error("오늘 이전 날짜의 회의는 예약이 불가합니다.");
          return;
        }
        this.onClickRoomRegBtn(target.attr('date'))
      },

      onClickRoomRegBtn: function (date) {
        var _this = this;

        var editRoomRegPopupView = new EditRoomRegPopupView(date, undefined, undefined);
        Dialog.show({
          title: '회의실 예약',
          content: editRoomRegPopupView,
          buttons:
            [{
              label: i18Common.DIALOG.BUTTON.ADD,
              cssClass: Dialog.CssClass.SUCCESS,
              action: function (dialogRef) {                              // 버튼 클릭 이벤트
                editRoomRegPopupView.onClickBtnReg().done(function () {
                  dialogRef.close();
                  editRoomRegPopupView.closeModal();
                  _this.reserveView.onClickRefresh();
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

      onClickCheckData: function (event) {
        var _this = this;

        $($("#cal_room_reg_popup_menu")[0]).css("display", "none");
        this.elements._isShowPopup = 0;
        event.stopPropagation();

        var event_data = event.currentTarget.offsetParent.id;
        var day = event_data.substr(8,2);
        var select_index = event.currentTarget.attributes.value.value;

        var roomRegList = _outputData[day - 1].attributes;
        for (var i = 0; i < roomRegList.length; i++) {
          if (i == select_index) {
            // Dialog Setting                   
            var editRoomRegPopupView = new EditRoomRegPopupView(this);
            editRoomRegPopupView.setData(roomRegList[i]);

            var buttonList = [];
            if (roomRegList[i].attributes.member_id == SessionModel.getUserInfo().id) {

              buttonList =
                [{
                  label: "회의 취소",
                  cssClass: Dialog.CssClass.SUCCESS,
                  action: function (dialogRef) {// 버튼 클릭 이벤트
                    editRoomRegPopupView.onClickBtnDel().done(function () {
                      dialogRef.close();
                      _this.reserveView.onClickRefresh();
                    });
                  }
                }, {
                  label: i18Common.DIALOG.BUTTON.SAVE,
                  cssClass: Dialog.CssClass.SUCCESS,
                  action: function (dialogRef) {// 버튼 클릭 이벤트
                    editRoomRegPopupView.onClickBtnReg().done(function () {
                      dialogRef.close();
                      _this.reserveView.onClickRefresh();
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
      },

    });
    return MonthCalendarView;
  });