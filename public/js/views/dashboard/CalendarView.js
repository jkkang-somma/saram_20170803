/**
 * 2017.08.03. ~ 2017.08.25.. 
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'code',
    'collection/dashboard/AttendanceCollection',
    'collection/dashboard/CommuteSummaryCollection',
    'text!templates/calendarTemplate.html'
], function ($, _, Backbone, Code, AttendanceCollection, CommuteSummaryCollection, calendarHTML) {

    var CalendarView = Backbone.View.extend({

        initialize: function (opt) {
            this.$el = $(opt.el);
            this.commuteSummaryCollection = new CommuteSummaryCollection();
            this.attendanceCollection = new AttendanceCollection();
        },
        _draw: function (params) {
            var _view = this;
            _view.getAttendance(params).done(function (result) {
                _view.attendance = result;

                _view.getCommuteSummary(params).done(function (result) {
                    _view.commuteSummary = result;
                    _view.drawCalendar(params);
                }).fail(function () {

                });
            }).fail(function () {

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
        drawCalendar: function (params) {
            var _view = this;
            var year = params.start.split("-")[0];
            var month = params.start.split("-")[1] - 1;

            var now = new Date();
            // 현재 달의 1일의 요일
            var theDate = new Date(year, month);
            var theDay = theDate.getDay();
            var lastDay = new Date(year, month + 1, 0).getDate();
            var row = Math.ceil((theDay + lastDay) / 7);
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

            for (var i = 0; i < lastDay; i++) {
                tmpDay = i + 1;
                workType = "";
                overTime = "";
                outOffice = "";
                vacation = "";
                openTag = "";
                exist = true;

                commuteData = _view.getCommuteByDay(year, month, i);

                if (commuteData.length == 0) {
                    attenData = _view.checkAtten(year, month, i);
                    if (_.isUndefined(attenData)) {
                        exist = false;
                    }else{
                        tmpTime = attenData.char_date.split(" ")[1].split(":");
                        workType = "<div class='attenTime'>" + tmpTime[0] + ":" + tmpTime[1] + closeTag;
                    }

                } else if (commuteData.length !== 0) {
                    workType = Code.getCodeName(Code.WORKTYPE, commuteData[0].work_type);
                    if (workType !== "휴일") {
                        if (workType === "조퇴" || workType === "지각"  || workType === "지각,조퇴") {
                            openTag = "<div class='work-late-leave'>";
                        } else if (workType === "결근" || workType === "결근_미결") {
                            openTag = "<div class='work-cri'>";
                            workType = "결근";
                        } else if (workType === "휴일근무_미결" ) {
                            // no display
                        } else if (workType === "휴일근무" ) {
                            openTag = "<div class='work-normal holiday'>";
                        } else if (workType === "출근기록_없음" ) {
                            openTag = "<div class='work-cri'>";
                            workType = "출근없음";
                        } else if (workType === "퇴근기록_없음" ) {
                            openTag = "<div class='work-cri'>";
                            workType = "퇴근없음";
                        }else{
                            openTag = "<div class='work-normal'>";
                        }

                        if (workType === "정상" ) {
                            // 정상인 경우 출력하지 않음.
                            workType="";
                        }else{
                            workType = openTag + workType + closeTag;   
                        }
                        
                    } else {
                        workType = "<div class='holiday'></div>";
                    }
                    if (commuteData[0].overtime_code != null) {
                        overTime = Code.getCodeName(Code.OVERTIME, commuteData[0].overtime_code);
                        if (overTime.includes("A형")) {
                            openTag = "<div class='overA'>";
                        } else if (overTime.includes("B형")) {
                            openTag = "<div class='overB'>";
                        } else {
                            openTag = "<div class='overC'>";
                        }
                        overTime = openTag + overTime.split("_")[1] + closeTag;
                    }
                    if (commuteData[0].out_office_code != null) {
                        outOffice = Code.getCodeName(Code.OFFICE, commuteData[0].out_office_code);
                        openTag = "<div class='outOffice'>";
                        outOffice = openTag + outOffice + closeTag;
                    }
                    if (commuteData[0].vacation_code != null) {
                        vacation = Code.getCodeName(Code.OFFICE, commuteData[0].vacation_code);
                        openTag = "<div class='vacation'>";
                        if (vacation.includes(",") && vacation.includes("(")) {
                            vacation = vacation.replace(/반차/g, "").replace(/휴가/g, "").replace(/ /g, "").replace("(오전)", "").replace("(오후)", "");
                        } else if (vacation.includes(",")) {
                            vacation = vacation.replace(/ /g, "").replace(/반차/g, "").replace(/휴가/g, "");
                        } else if (vacation.includes("(")) {
                            vacation = vacation.replace("휴가", "").replace("(", "").replace(")", "");
                        }
                        vacation = openTag + vacation + closeTag;
                    }
                }
                var pushData = {
                    "days": tmpDay,
                    "workType": workType,
                    "overTime": overTime,
                    "outOffice": outOffice,
                    "vacation": vacation,
                    "exist" : exist
                };
                data.push(pushData);
            }

            var calendarData = { "row": row, "theDay": theDay, "lastDay": lastDay, "year": year, "month": month, "data": data };

            this.$el.html(_.template(calendarHTML)(calendarData));

            var today = $('.attenTime');
            if (today.length > 0) {
                $('.attenTime').parent().parent().parent().parent().css('border', '2px solid #34495e');
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
        },

        checkAtten: function (year, month, day) {
            var _view = this;
            var dateStr = "";
            var result = _.select(_view.attendance, function (atten) {
                dateStr = year + "-";
                dateStr += (month < 9) ? "0" + (month + 1) + "-" : dateStr += (month + 1) + "-";
                dateStr += (day < 9) ? "0" + (day + 1) : (day + 1);

                if (atten.char_date.split(" ")[0] == dateStr && atten.type == "출근(지문)" && Number(atten.char_date.split(" ")[1].split(":")[0]) > 5) {
                    return atten.char_date;
                }
            });
            if (result.length != 0) {
                return result[0];
            } else {
                result = _.select(_view.attendance, function (atten) {
                    if (atten.char_date.split(" ")[0] == dateStr && atten.type == "출입(지문)" && Number(atten.char_date.split(" ")[1].split(":")[0]) > 5) {
                        return atten.char_date;
                    }
                });
                return result[0];
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
        }

    });
    return CalendarView;
});