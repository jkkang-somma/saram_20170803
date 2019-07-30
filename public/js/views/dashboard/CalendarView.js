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
  'schemas',
  'dialog',
  'i18n!nls/common',
  'models/sm/SessionModel',
  'collection/dashboard/AttendanceCollection',
  'collection/dashboard/CommuteSummaryCollection',
  'collection/common/HolidayCollection',
  'collection/vacation/InOfficeCollection',
  'collection/vacation/OutOfficeCollection',
  'views/cm/popup/OvertimeApprovalPopupView',
  'text!templates/calendarTemplateBase.html',
  'views/rm/AddNewReportView',
], function ($, _, Backbone, Code, Moment, Util, Schemas, Dialog, i18nCommon, SessionModel, AttendanceCollection, CommuteSummaryCollection, HolidayCollection,
  InOfficeCollection, OutOfficeCollection, OvertimeApprovalPopupView, calendarHTML, AddNewReportView) {

    var CalendarView = Backbone.View.extend({

      elements: {
        targetUserId: "",
        _isShowPopup: 0, // 0: none , 1: ignore, 2: display
        cleanDay: "",
        overTimeWeek: []
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
        'click #calendarSubmit': 'onClickOpenOvertimePopup',
        'click .clickable': 'onClickDayLink',
        'click td': 'onClickDaySubmit',
        'click #submit_item' : 'onClickSubmitMenu'
      },
      _draw: function (params, cleanDay, overTimeWeek) {
        this.elements.targetUserId = params.id;
        this.elements.cleanDay = cleanDay;
        this.elements.overTimeWeek = overTimeWeek;
        var _view = this;
        var yearData = new Moment(params.start);
        _view.getHolidaySummary({ year: yearData.year() }).done(function (result) { // 휴일 조회
          _view.holiday = result;
          _view.getInOutofficeSummary(params).done(function (result) {
            _view.inOutData = result;
            _view.getAttendance(params).done(function (result) {  // 출입 기록 조회
              _view.attendance = result;
              _view.getCommuteSummary(params).done(function (result) {
                _view.commuteSummary = result;
                _view.drawCalendar(params);
              }).fail(function () {

              });
            }).fail(function () {

            });
          });
        }).fail(function () {

        });

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

      getInOutofficeSummary: function (params) {
        var _view = this;
        var dfd = new $.Deferred();

        var inOfficeCollection = new InOfficeCollection();
        var outOfficeCollection = new OutOfficeCollection();

        $.when(
          outOfficeCollection.fetch({
            data: params
          }),
          inOfficeCollection.fetch({
            data: params
          })
        ).done(function () {
          // var id = SessionModel.getUserInfo().id;
          var data = {
            outoffice: outOfficeCollection.filterID(params.id),
            inoffice: inOfficeCollection.filterID(params.id)
          };
          // console.log(data);
          dfd.resolve(data);
        });

        return dfd.promise();
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
      getAttendance: function (params) {
        var _view = this;
        var dfd = new $.Deferred();
        this.attendanceCollection.fetch({
          data: params,
          success: function (attendanceCollection, result) {
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
            // console.log(dd);
            var holId = holDate.format("YYYY-MM-DD");
            var holCon = $(_view.el).find('#' + holId);
            holCon.addClass('holiday');
            // cc-header
            holCon.find('.cc-header').append('<span>' + dd.memo + '</span>')
          }

        });
      },

      drawCleanDay: function () {
        var _view = this;
        if (this.elements.cleanDay === "") {
          return;
        }

        var toDay = new Moment().format('YYYY-MM-DD');
        if (this.elements.cleanDay < toDay) {
          return;
        }

        var cleanDayEl = $(_view.el).find('#' + this.elements.cleanDay);
        if (cleanDayEl.length === 1) {
          cleanDayEl.addClass('clean-day');
          cleanDayEl.attr('title', '쾌적한 근무 환경 및 임직원 건강을 위해 청소하는 날입니다~');
        }
      },

      drawOverTimeWeek: function () {
        var _view = this;
        if (SessionModel.getUserInfo().admin !== Schemas.ADMIN) {
          return;
        }
        if (this.elements.overTimeWeek === []) {
          return;
        }

        for (var overTime of this.elements.overTimeWeek) {
          if (overTime.overTime) {
            var baseDate = overTime.date;
            var overTimeEl = $(_view.el).find('#' + baseDate + " .over-time");
            if (overTimeEl.length === 1) {
              overTimeEl.html(Util.timeformat(overTime.overTime, true));
              if (overTime.overTime > 720) {
                overTimeEl.addClass("red");
              }
            }
          }
        }
      },

      drawCalendar: function (params) {
        var _view = this;
        var year = params.start.split("-")[0];
        var month = params.start.split("-")[1] - 1;

        //var now = new Date();
        // 현재 달의 1일의 요일
        var theDate = new Date(year, month);
        var startDayOfWeek = theDate.getDay();
        var lastDay = new Date(year, month + 1, 0).getDate();
        var row = Math.ceil((startDayOfWeek + lastDay) / 7);
        var data = [];
        var commuteData;
        var attenData;
        var workType;
        var overTime;
        var outOffice;
        var vacation;
        var tmpDay;
        var tmpTime;
        var openTag;
        var closeTag = "</div>";
        var exist = true;
        var inoutData = _view.inOutData;

        for (var i = 0; i < lastDay; i++) {
          tmpDay = i + 1;
          workType = "";
          overTime = "";
          outOffice = "";
          vacation = "";
          openTag = "";
          exist = true;

          commuteData = _view.getCommuteByDay(year, month, i);

          var dateStr = year + "-";
          dateStr += (month < 9) ? "0" + (month + 1) + "-" : (month + 1) + "-";
          dateStr += (i < 9) ? "0" + (i + 1) : (i + 1);
          if (commuteData.length == 0) {
            attenData = _view.checkAtten(year, month, i);
            if (_.isUndefined(attenData)) {
              exist = false;
            } else {
              // need_confirm == 2 인 경우 빨강색으로 표시
              tmpTime = attenData.char_date.split(" ")[1].split(":");
              if (attenData.need_confirm === 1) {
                workType = "<div class='attenTime'>" + tmpTime[0] + ":" + tmpTime[1] + closeTag;
              } else {
                workType = "<div class='attenTime' style='color:red'>" + tmpTime[0] + ":" + tmpTime[1] + closeTag;
                overTime = "<div class='attenTime' style='color:red'>확인필요</div>"
              }
            }

          } else { // commuteData.length !== 0
            workType = Code.getCodeName(Code.WORKTYPE, commuteData[0].work_type);
            if (workType !== "휴일") {
              if (workType === "조퇴" || workType === "지각" || workType === "지각,조퇴") {
                openTag = "<div class='work-late-leave'>";
              } else if (workType === "결근" || workType === "결근_미결") {
                openTag = "<div class='work-cri'>";
                workType = "결근";
              } else if (workType === "휴일근무_미결") {
                // no display
              } else if (workType === "휴일근무") {
                openTag = "<div class='work-normal holiday'>";
              } else if (workType === "출근기록_없음") {
                openTag = "<div class='work-cri'>";
                workType = "출근없음";
              } else if (workType === "퇴근기록_없음") {
                openTag = "<div class='work-cri'>";
                workType = "퇴근없음";
              } else {
                openTag = "<div class='work-normal'>";
              }

              if (workType === "정상") {
                // 정상인 경우 출력하지 않음.
                workType = "";
              } else {
                workType = openTag + workType + closeTag;
              }

            } else {
              workType = "<div class='holiday'></div>";
            }
            if (commuteData[0].overtime_code != null) {
              overTime = Code.getCodeName(Code.OVERTIME, commuteData[0].overtime_code);
              if (overTime.indexOf("A형") >= 0) {
                openTag = "<div class='overA'>";
              } else if (overTime.indexOf("B형") >= 0) {
                openTag = "<div class='overB'>";
              } else {
                openTag = "<div class='overC'>";
              }
              overTime = openTag + overTime.split("_")[1] + closeTag;
            } else {
              // 상신 버튼 출력
              if (commuteData[0].work_night_falg === '상신') {
                overTime = '<div class="work-normal">상신중</div>'
              } else if (Moment(_view.overTimeDay).isBefore(commuteData[0].date) || Moment(_view.overTimeDay).isSame(commuteData[0].date)) {
                if (commuteData[0].over_time >= 120) {
                  if (commuteData[0].id === SessionModel.getUserInfo().id) {
                    overTime = '<button id="calendarSubmit" class="overSubmit glyphicon glyphicon-edit">상신</button>'
                  } else {
                    overTime = '<button id="calendarSubmit" disabled class="overSubmit no-hover glyphicon glyphicon-edit">상신</button>'
                  }
                }
              }
            }
          }

          // outoffice 
          var outOfficeInfo = _.find(inoutData.outoffice, function (d) {
            var data = d.attributes;
            return data.date == dateStr;
          });
          // if (commuteData[0].out_office_code != null) {
          if (!_.isUndefined(outOfficeInfo)) {
            var outCode = outOfficeInfo.attributes.office_code;
            outOffice = Code.getCodeName(Code.OFFICE, outCode);
            if (outOffice.indexOf('휴가') > -1 || outOffice.indexOf('반차') > -1) {
              openTag = "<div class='vacation'>";
              if (outOffice.indexOf(",") >= 0 && outOffice.indexOf("(") >= 0) {
                outOffice = outOffice.replace(/반차/g, "").replace(/휴가/g, "").replace(/ /g, "").replace("(오전)", "").replace("(오후)", "");
              } else if (outOffice.indexOf(",") >= 0) {
                outOffice = outOffice.replace(/ /g, "").replace(/반차/g, "").replace(/휴가/g, "");
              } else if (outOffice.indexOf("(") >= 0) {
                outOffice = outOffice.replace("휴가", "").replace("(", "").replace(")", "");
              }
            } else {
              openTag = "<div class='outOffice'>";
            }
            outOffice = openTag + outOffice + closeTag;
          }

          var pushData = {
            "days": tmpDay,
            "workType": workType,
            "overTime": overTime,
            "outOffice": outOffice,
            "vacation": vacation,
            "exist": exist,
            "commuteExist": commuteData.length === 1
          };
          data.push(pushData);
        }

        //var calendarData = { "row": row, "startDayOfWeek": startDayOfWeek, "lastDay": lastDay, "year": year, "month": month, "data": data };
        //this.$el.html(_.template(calendarHTML)(calendarData));

        this.$el.html(calendarHTML);
        var calBody = $(this.el).find("#calendar_body");
        var resultHtml = this.makeOneWeekHtml(row, startDayOfWeek, lastDay, year, month, data);
        calBody.append(resultHtml);

        var todayBox = $(this.el).find("#" + this._today);
        if (todayBox.length > 0) {
          todayBox.css('border', '2px solid #34495e');
        }

        // 2019.07.19 KJK 아래 코드 왜 있는지 모르겠음...
        // var holiday = $('.holiday');
        // var bgColor1 = $('.cc-header').eq(0).css("background-color");
        // var bgColor2 = $('.cc-header').eq(6).css("background-color");
        // var textColor = $('.cc-header').eq(0).css("color")
        // var target;
        // for (var k = 0, len = holiday.length; k < len; k++) {
        //   target = $('.holiday').parent().parent().parent().find('.cc-header').eq(k);
        //   if (bgColor1 !== target.css("background-color") && bgColor2 !== target.css("background-color")) {
        //     target.css("background-color", bgColor1);
        //     target.css("color", textColor);
        //   }
        // }

        _view.drawHoliday(params.start);
        _view.drawCleanDay();
        _view.drawOverTimeWeek();
      },

      makeOneWeekHtml: function (row, startDayOfWeek, lastDay, year, month, data) {
        var resultHtml = '';

        var tdTemplate = '<td id="" class="">';
        var calendar_content = '<div class="calendar-content">';
        var cc_header = '<div class="cc-header <HEADER_CLASS>"><DAY></div>';
        var cc_content = '<div class="c-content"> <div class="text"><A></div><div class="text"><B></div> </div>';

        var day = 0;
        var lastDate = "";
        var lastIndex = 1;
        for (var i = 1; i <= row; i++) {
          resultHtml += "<tr>";

          for (var j = 1; j <= 7; j++) {
            if (i == 1 && j <= startDayOfWeek) {
              // 1일 시작 전
              // if ( data[0].exist ) {
              var prevDate = Moment(year + "-" + (month+1) + "-1").add(j - startDayOfWeek - 1, "days").format('YYYY-MM-DD');
              resultHtml += tdTemplate;
              resultHtml = resultHtml.replace('id=""', 'id="' +prevDate + '"');

              resultHtml += cc_header.replace("<HEADER_CLASS>", "opacity3").replace("<DAY>", prevDate.substr(8,2));
              resultHtml += cc_content.replace("<A>", "").replace("<B>", "");
              resultHtml += cc_content.replace("<A>", "").replace('<div class="text"><B>', '<div class="over-time">');
              continue;
            } else if (_.isUndefined(data[day])) {
              // 말일 종료 후
              resultHtml += tdTemplate;
              var afterDate = Moment(lastDate).add(lastIndex++, "days").format('YYYY-MM-DD');
              resultHtml = resultHtml.replace('id=""', 'id="' + afterDate + '"');
              resultHtml += cc_header.replace("<HEADER_CLASS>", "opacity3").replace("<DAY>", afterDate.substr(9,1));
              resultHtml += cc_content.replace("<A>", "").replace("<B>", "");
              resultHtml += cc_content.replace("<A>", "").replace('<div class="text"><B>', '<div class="over-time">');
            } else {
              // 1일 ~ 말일까지                        
              if (j == 7) {
                // 토요일
                resultHtml += tdTemplate.replace('class=""', 'class="saturday"');
              } else if (j == 1 || data[day].workType.indexOf("holiday") >= 0) {
                // 쉬는 날
                resultHtml += tdTemplate.replace('class=""', 'class="holiday"');
              } else {
                if (data[day].exist) {
                  resultHtml += tdTemplate;
                } else {
                  resultHtml += tdTemplate.replace('class=""', 'class="disabled"');
                }
              }

              lastDate = year + '-' + Util.get02dStr(month + 1) + '-' + Util.get02dStr(data[day].days);
              resultHtml = resultHtml.replace('id=""', 'id="' + lastDate + '"');

              resultHtml += calendar_content;
              resultHtml += cc_header.replace("<DAY>", data[day].days);

              if (data[day].commuteExist === true && SessionModel.getUserInfo().id === this.elements.targetUserId) {
                resultHtml = resultHtml.replace("<HEADER_CLASS>", "clickable");
              } else {
                resultHtml = resultHtml.replace("<HEADER_CLASS>", "");
              }
              resultHtml += cc_content.replace("<A>", data[day].workType).replace("<B>", data[day].overTime);
              // resultHtml += cc_content.replace("<A>", data[day].outOffice).replace("<B>", data[day].vacation);
              resultHtml += cc_content.replace("<A>", data[day].outOffice).replace('<div class="text"><B>', '<div class="over-time">');
              // 윗 코드에 관하여... 원래 설계상 네번째 칸에 vacation 정보를 출력하려 하였으나 구현오류로 인하여 vacation 정보가 세번째 칸에 outOffice에 출력되고 있음.
              // 따라서 네번재 칸은 매주 월요일 자리에 주간 초과근무 시간을 출력하도록 추가 구현 함.
            }
            day++;
            resultHtml += "</div></td>"; // calendar-content
          }

          resultHtml += "</tr>";
        }
        return resultHtml;
      },

      checkAtten: function (year, month, day) {
        var _view = this;
        var dateStr = "";
        var result = _.select(_view.attendance, function (atten) {
          dateStr = year + "-";
          dateStr += (month < 9) ? "0" + (month + 1) + "-" : (month + 1) + "-";
          dateStr += (day < 9) ? "0" + (day + 1) : (day + 1);

          if (atten.char_date.split(" ")[0] == dateStr && atten.type.indexOf("출근") > -1 && Number(atten.char_date.split(" ")[1].split(":")[0]) > 5) {
            return atten.char_date;
          }
        });
        if (result.length != 0) {
          var confirmResult = _.filter(result, { need_confirm: 1 })
          if (confirmResult.length !== 0) {
            // 정상적인 첫번째 출근시간을 return
            return confirmResult[0]
          }
          return result[0];
          // 아래 로직이 왜 필요한지 모르겠음. KJK 2019.04.15
          // } else {
          //     result = _.select(_view.attendance, function (atten) {
          //         if (atten.char_date.split(" ")[0] == dateStr && atten.type.indexOf("출근") > -1 && Number(atten.char_date.split(" ")[1].split(":")[0]) > 5) {
          //             return atten.char_date;
          //         }
          //     });
          //     return result[0];
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

      onClickOpenOvertimePopup: function (evt) {
        // window.location.href = "#commutemanager";
        window.location.href = "#commutemanager/" + evt.target.parentElement.parentElement.parentElement.parentElement.id;
        // var index = $(evt.currentTarget).attr('data');
        // var selectItem = {
        //     department : SessionModel.getUserInfo().id,
        //     name : SessionModel.getUserInfo().name,
        //     in_time : '',
        //     out_time : '',
        //     over_time : ''
        // }
        // var overtimeApprovalPopupView = new OvertimeApprovalPopupView(selectItem);

        // // console.log("grid data", selectItem);
        // var _this = this;
        // var clickFlag = false;
        // Dialog.show({
        //     title: "초과근무 결재", 
        //     content: overtimeApprovalPopupView,
        //     buttons: [{
        //         label : "상신",
        //         cssClass: Dialog.CssClass.SUCCESS,
        //         action : function(dialog){
        //             if ( clickFlag ) {
        //                 console.log("IN skip");
        //                 return;
        //             }
        //             clickFlag =true;

        //             var inputData = overtimeApprovalPopupView.getData();
        //             // console.log(inputData);

        //             var checkTime = selectItem.over_time - inputData.except;
        //             if ( checkTime < 120 ) {
        //                 Dialog.error("초과근무 시간이 유효하지 않습니다.");
        //                 clickFlag =false;
        //                 return;
        //             }

        //             if( inputData["overtimeReason"] == "" ){
        //                 Dialog.warning("사유를 입력하여 주시기 바랍니다.");
        //                 return null;
        //             }
        //             _this.sendApprovalOvertime(dialog, selectItem, inputData);

        //         }
        //     },{
        //         label : i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.BUTTON.CANCEL,
        //         action : function(dialog){
        //             dialog.close();
        //         }
        //     }]
        // });
      },

      onClickDayLink: function(evt) {
        if (evt.target.parentElement.parentElement.id === "") {
          window.location.href = "#commutemanager/" + evt.target.parentElement.parentElement.parentElement.id;
        } else {
          window.location.href = "#commutemanager/" + evt.target.parentElement.parentElement.id;
        }
      },

      resetPopupMenu: function () {
        // 0: none , 1: ignore, 2: display
        if (this.elements._isShowPopup == 0 || this.elements._isShowPopup == 1) {
          this.elements._isShowPopup = 2;
          return;
        }

        $($("#submit_popup_menu")[0]).css("display", "none");
        this.elements._isShowPopup = 0;
      },

      onClickDaySubmit: function(event) {
        this.elements._isShowPopup = 0;

        var targetDate = event.target.parentElement.parentElement.parentElement.id;
        if (targetDate === "" || targetDate === "calendar_body") {
          targetDate = event.target.parentElement.parentElement.id;
          if (targetDate === "") {
            // over-time class 인 경우에 날짜 찾기
            targetDate = event.target.id;
            if (targetDate === "") {
              return;
            }
          }
        }
        var now = new Moment().format("YYYY-MM-DD");
        if (targetDate >= now) {
          $($("#submit_popup_menu")[0]).css("display", "block").css("top", event.pageY).css("left", event.pageX);
          $($("#submit_item")[0]).attr("date", targetDate);
          this.elements._isShowPopup = 1;
        }
      },

      onClickSubmitMenu: function() {
        var addNewReportView = new AddNewReportView();
        var targetDate = $($("#submit_item")[0]).attr("date");
        addNewReportView.setTargetDate(targetDate);
        
        Dialog.show({
            title: "결재 상신",
            content: addNewReportView,
            buttons: [{
                label: "상신",
                cssClass: Dialog.CssClass.SUCCESS,
                action: function(dialogRef) { // 버튼 클릭 이벤트
                    addNewReportView.onClickBtnSend(dialogRef).done(function(model) {
                        window.location.href = "#reportmanager";
                        Util.destoryDateTimePicker(true); dialogRef.close();
                    });
                }
            }, {
                label: '닫기',
                action: function(dialogRef) {
                  Util.destoryDateTimePicker(true); dialogRef.close();
                }
            }]
        });
    },

    });
    return CalendarView;
  });