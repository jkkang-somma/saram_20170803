define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'cmoment',
  'grid',
  'lodingButton',
  'schemas',
  'i18n!nls/common',
  'dialog',
  'util',
  'views/statistics/DeptSummaryDetailPopup',
  'text!templates/default/head.html',
  'text!templates/default/row.html',
  'text!templates/default/rowdatepicker.html',
  'text!templates/default/rowbuttoncontainer.html',
  'text!templates/default/rowbutton.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/button.html',
  'text!templates/statistics/deptSummaryRow.html'
], function ($, _, Backbone, BaseView, Moment, Grid, LodingButton, Schemas, i18nCommon, Dialog, Util, DeptSummaryDetailPopup,
  HeadHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, ContentHTML, LayoutHTML,
  ButtonHTML, DeptSummaryRowHtml) {

    var OvertimeReportView = BaseView.extend({
      el: $(".main-container"),
      initialize: function () {
        var _this = this;
        this.option = {
          currentYearMonth: null
        }
        this.gridOption = {
          el: "statistics_report1_content",
          id: "statistics_report1_table",
          column: [
            { data: "department", title: "부서" },
            { data: "name", title: "이름" },

            { data: "TOTAL_A", title: "초과근무<BR>시간", className: "dt-head-center dt-body-right major-column" },
            { data: "TOTAL_B", title: "휴일근무<BR>시간", className: "dt-head-center dt-body-right major-column" },
            { data: "TOTAL_AB", title: "초과근무<BR>시간 합계", className: "dt-head-center dt-body-right major-column" },

            { data: "total_person", title: "인원", className: "dt-head-center dt-body-center" },

            { data: "AA", title: "야근_A", className: "dt-head-center dt-body-center" },
            { data: "AB", title: "야근_B", className: "dt-head-center dt-body-center" },
            { data: "AC", title: "야근_C", className: "dt-head-center dt-body-center" },

            { data: "total_B_day", title: "휴일근무<BR>일수", className: "dt-head-center dt-body-center major-column" },
            { data: "BA", title: "휴일_A", className: "dt-head-center dt-body-center" },
            { data: "BB", title: "휴일_B", className: "dt-head-center dt-body-center" },
            { data: "BC", title: "휴일_C", className: "dt-head-center dt-body-center" },

            { data: "total_day", title: "연차휴가", className: "dt-head-center dt-body-center vacation-column" },
            { data: "used_day", title: "연차사용<BR>일수(년)", className: "dt-head-center dt-body-center vacation-column" },
            { data: "remain_day", title: "연차잔여<BR>일수(년)", className: "dt-head-center dt-body-center vacation-column" }
          ],
          collection: null,
          //dataschema:["department", "score", "total_persion", "late", "leave_early", "late_leave_early", "absent", "data_none_1", "data_none_2"],
          detail: true,
          fetch: false,
          order: [[5, "desc"]]
        };
      },

      beforeDestroy: function() {
        Util.destoryDateTimePicker(false);
      },

      events: {
        'click #SearchBtn1': 'onClickSearchPersonBtn',
        'click #SearchBtn2': 'onClickSearchDeptBtn',
        'click #statistics_report1_table .td-dept-summary': 'onClickDetailPopup',
      },

      render: function (viewType, searchParams) {
        //var _view=this;
        this.viewType = (viewType != undefined) ? viewType : 'default';
        this.searchParams = searchParams;
        var _headSchema = Schemas.getSchema('headTemp');
        var _headTemp = _.template(HeadHTML);
        var _layOut = $(LayoutHTML);

        var _head = $(_headTemp(_headSchema.getDefault(
          {
            title: "근태통계",
            subTitle: "휴가/초과근무 리포트"
          }
        )));

        _head.addClass("no-margin");
        _head.addClass("relative-layout");

        var _row = $(RowHTML);
        var _datepickerFromRange = $(_.template(DatePickerHTML)(
          { obj: { dateId: "FromDatePicker" } })
        );
        var _datepickerToRange = $(_.template(DatePickerHTML)(
          { obj: { dateId: "toDatePicker" } })
        );
        var _btnContainer = $(_.template(RowButtonContainerHTML)({
          obj: { id: "ccmBtnContainer" }
        }));

        var _searchBtn1 = $(_.template(RowButtonHTML)({
          obj: {
            id: "SearchBtn1",
            label: "개인",
          }
        }));

        var _searchBtn2 = $(_.template(RowButtonHTML)({
          obj: {
            id: "SearchBtn2",
            label: "부서",
          }
        }));

        _btnContainer.append(_searchBtn2);
        _btnContainer.append(_searchBtn1);

        _row.append(_datepickerFromRange);
        _row.append(_datepickerToRange);
        _row.append(_btnContainer);
        var _content = $(ContentHTML).attr("id", this.gridOption.el);

        if (this.viewType != "dashboard") {
          _layOut.append(_head);
          _layOut.append(_row);
        }
        _layOut.append(_content);

        $(this.el).html(_layOut);

        // datePkcker 초기화	    
        var today = new Date();

        $(this.el).find("#FromDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          defaultDate: Moment(today).set('date', 1).format("YYYY-MM-DD")
        });

        $(this.el).find("#ToDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          defaultDate: Moment(today).format("YYYY-MM-DD")
        });

        // var _gridSchema=Schemas.getSchema('grid');
        // this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
        // this.grid.render();

        this.selectReport(true);

        return this;
      },

      onClickSearchPersonBtn: function (evt) {
        this.selectReport(false);
      },

      onClickSearchDeptBtn: function (evt) {
        this.selectReport(true);
      },

      gridColumnRender: function (data, full, typeValue) {
        if (data == 0)
          return data;

        var obj = {
          dept: full.department,
          type: typeValue,
          value: data
        };
        var tpl = _.template(DeptSummaryRowHtml)(obj);
        return tpl;
      },

      selectReport: function (isDept) {
        var _this = this;
        var startDate = Moment($(_this.el).find("#FromDatePicker").data("DateTimePicker").getDate());
        var endDate = Moment($(_this.el).find("#toDatePicker").data("DateTimePicker").getDate());
        var startDateStr = startDate.format('YYYY-MM-DD');
        var endDateStr = endDate.format('YYYY-MM-DD');

        if (startDateStr.substring(0, 4) != endDateStr.substring(0, 4)) {
          Dialog.error("시작일과 종료일의 연도를 동일하게 설정하십시오.");
          return;
        }

        var type = "DEPT";
        if (!isDept) {
          type = "PERSON";
        }

        Dialog.loading({
          action: function () {
            var dfd = new $.Deferred();
            Util.ajaxCall("/statistics/report1", "GET", { type: type, from: startDateStr, to: endDateStr }).then(function (result) {
              var workTypeList = ["used_day", "AA", "AB", "AC", "TOTAL_A", "BA", "BB", "BC", "total_B_day", "TOTAL_B"];
              for (var i = 0; i < result.OverTimeInfo.length; i++) {

                var t = _.find(result.VacationInfo, function (item) {
                  if (result.OverTimeInfo[i].id == item.id)
                    return item;
                });

                result.OverTimeInfo[i].total_B_day = result.OverTimeInfo[i].BA + result.OverTimeInfo[i].BB + result.OverTimeInfo[i].BC;
                result.OverTimeInfo[i].TOTAL_AB = result.OverTimeInfo[i].TOTAL_A + result.OverTimeInfo[i].TOTAL_B;

                if (result.OverTimeInfo[i].TOTAL_A == 0) {
                  result.OverTimeInfo[i].TOTAL_A = "";
                } else {
                  result.OverTimeInfo[i].TOTAL_A = Util.timeformat(result.OverTimeInfo[i].TOTAL_A);
                }

                if (result.OverTimeInfo[i].TOTAL_B == 0) {
                  result.OverTimeInfo[i].TOTAL_B = "";
                } else {
                  result.OverTimeInfo[i].TOTAL_B = Util.timeformat(result.OverTimeInfo[i].TOTAL_B);
                }

                if (result.OverTimeInfo[i].TOTAL_AB == 0) {
                  result.OverTimeInfo[i].TOTAL_AB = "";
                } else {
                  result.OverTimeInfo[i].TOTAL_AB = Util.timeformat(result.OverTimeInfo[i].TOTAL_AB);
                }

                if (_.isUndefined(t) || t == null) {
                  result.OverTimeInfo[i].total_day = "";
                  result.OverTimeInfo[i].used_day = "";
                  result.OverTimeInfo[i].remain_day = "";
                } else {
                  result.OverTimeInfo[i].total_day = t.total_day;
                  result.OverTimeInfo[i].used_day = t.used_holiday;
                  result.OverTimeInfo[i].remain_day = t.total_day - t.used_holiday;
                }

                for (var j = 0; j < workTypeList.length; j++) {
                  if (result.OverTimeInfo[i][workTypeList[j]] == 0) {
                    result.OverTimeInfo[i][workTypeList[j]] = "";
                  }
                }

                if (_.isUndefined(result.OverTimeInfo[i].name)) {
                  result.OverTimeInfo[i].name = '';
                }
                if (_.isUndefined(result.OverTimeInfo[i].total_person)) {
                  result.OverTimeInfo[i].total_person = 0;
                }
              }

              if (isDept) {
                // 이름
                _this.gridOption.column[1].visible = false;
                // // 연차
                _this.gridOption.column[13].visible = false;
                _this.gridOption.column[14].visible = false;
                _this.gridOption.column[15].visible = false;
                // // 총원
                _this.gridOption.column[5].visible = true;

                _this.gridOption.buttons = ["search"];

                for (var j = 0; j < result["DeptPersionCount"].length; j++) {
                  for (var k = 0; k < result.OverTimeInfo.length; k++) {
                    if (result.OverTimeInfo[k].department == result["DeptPersionCount"][j].department) {
                      result.OverTimeInfo[k].total_person = result["DeptPersionCount"][j].count;
                      break;
                    }
                  }
                }
              } else {
                // 이름
                _this.gridOption.column[1].visible = true;
                // // 연차
                _this.gridOption.column[13].visible = true;
                _this.gridOption.column[14].visible = true;
                _this.gridOption.column[15].visible = true;
                // // 총원
                _this.gridOption.column[5].visible = false;

                _this.gridOption.buttons = ["search", {
                  type: "myDeptRecord",
                  name: "myDeptRecord",
                  filterColumn: ["department"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
                  tooltip: ""
                }];
              }

              // set grid
              _this.gridOption.collection = {
                data: result["OverTimeInfo"],
                toJSON: function () {
                  return result["OverTimeInfo"];
                }
              };

              var _gridSchema = Schemas.getSchema('grid');
              _this.grid = new Grid(_gridSchema.getDefault(_this.gridOption));

              _this.option.from = startDate;
              _this.option.to = endDate;

              dfd.resolve();
            });
            return dfd.promise();
          }
        });
      },

      onClickDetailPopup: function (evt) {
        var _this = this;

        var data = JSON.parse($(evt.currentTarget).attr('data'));
        data["from"] = this.option.fromDate;
        date["to"] = this.option.fromDate;

        var deptSummaryDetailPopup = new DeptSummaryDetailPopup(data);
        Dialog.show({
          title: "세부내역 (" + _this.option.currentYearMonth + ", " + data.dept + ")",
          content: deptSummaryDetailPopup,
          buttons: [{
            label: "닫기",
            action: function (dialog) {
              dialog.close();
            }
          }]
        });
      }
    });
    return OvertimeReportView;
  });
