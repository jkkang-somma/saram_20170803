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
  'text!templates/default/rowdatepickerRange.html',
  'text!templates/default/rowbuttoncontainer.html',
  'text!templates/default/rowbutton.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/button.html',
  'text!templates/statistics/deptSummaryRow.html'
], function ($, _, Backbone, BaseView, Moment, Grid, LodingButton, Schemas, i18nCommon, Dialog, Util, DeptSummaryDetailPopup,
  HeadHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, ContentHTML, LayoutHTML,
  ButtonHTML, DeptSummaryRowHtml) {

    var AbnormalSummaryView = BaseView.extend({
      el: $(".main-container"),
      initialize: function () {
        var _this = this;
        this.option = {
          currentFrom: null,
          currentTo: null
        }
        this.gridOption = {
          el: "dept_summary_content",
          id: "deptSummaryTable",
          column: [
            { data: "department", title: "부서" },
            { data: "name", title: "이름" },
            { data: "score", title: "점수", className: "dt-head-center dt-body-center major-column" },
            { data: "total_person", title: "총원", className: "dt-head-center dt-body-center" },
            {
              data: "late", title: "지각", className: "dt-head-center dt-body-center",
              render: function (data, type, full, meta) {
                return _this.gridColumnRender(data, full, "10");
              }
            },
            {
              data: "leave_early", "title": "조퇴", className: "dt-head-center dt-body-center",
              render: function (data, type, full, meta) {
                return _this.gridColumnRender(data, full, "01");
              }
            },
            {
              data: "late_leave_early", "title": "지각&조퇴", className: "dt-head-center dt-body-center",
              render: function (data, type, full, meta) {
                return _this.gridColumnRender(data, full, "11");
              }
            },
            {
              data: "absent", "title": "결근", className: "dt-head-center dt-body-center",
              render: function (data, type, full, meta) {
                return _this.gridColumnRender(data, full, "21");
              }
            },
            {
              data: "data_none_1", "title": "출근 없음", className: "dt-head-center dt-body-center",
              render: function (data, type, full, meta) {
                return _this.gridColumnRender(data, full, "50");
              }
            },
            {
              data: "data_none_2", "title": "퇴근 없음", className: "dt-head-center dt-body-center",
              render: function (data, type, full, meta) {
                return _this.gridColumnRender(data, full, "51");
              }
            }
          ],
          collection: null,
          // dataschema:["department", "score", "total_persion", "late", "leave_early", "late_leave_early", "absent", "data_none_1", "data_none_2"],
          detail: true,
          buttons: ["search"],
          fetch: false,
          order: [[3, "desc"]]
        };
      },

      events: {
        'click #SearchBtn': 'onClickSearchBtn',
        'click #SearchBtnPerson': 'onClickSearchBtnPerson',
        'click #deptSummaryTable .td-dept-summary': 'onClickDetailPopup',
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
            subTitle: "지각현황"
          }
        )));

        _head.addClass("no-margin");
        _head.addClass("relative-layout");

        var _row = $(RowHTML);
        var _datepickerRange = $(_.template(DatePickerHTML)({
          obj: { fromId: "FromDatePicker", toId: "ToDatePicker" }
        })
        );
        var _btnContainer = $(_.template(RowButtonContainerHTML)({
          obj: { id: "ccmBtnContainer" }
        })
        );

        var _searchBtn = $(_.template(RowButtonHTML)
          ({ obj: { id: "SearchBtn", label: "부서" } })
        );

        var _searchBtnPerson = $(_.template(RowButtonHTML)({
          obj: { id: "SearchBtnPerson", label: "개인" }
        })
        );

        _btnContainer.append(_searchBtn);
        _btnContainer.append(_searchBtnPerson);

        _row.append(_datepickerRange);
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
          // minViewMode : 1,    // 년/월만 선택하도록 하는 옵션
          defaultDate: Moment(today).set('date', 1).format("YYYY-MM-DD")
        });

        $(this.el).find("#ToDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          // minViewMode : 1,    // 년/월만 선택하도록 하는 옵션
          defaultDate: Moment(today).format("YYYY-MM-DD")
        });

        // var _gridSchema=Schemas.getSchema('grid');
        //this.grid= new Grid(_gridSchema.getDefault(this.gridOption));
        //this.grid.render();
        this.selectDeptSummary(true);

        return this;
      },

      onClickSearchBtn: function (evt) {
        this.selectDeptSummary(true);
      },

      onClickSearchBtnPerson: function (evt) {
        this.selectDeptSummary(false);
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

      selectDeptSummary: function (isDept) {
        var _this = this;
        // 대시보드인 경우 해당 월의 시작/끝을 임의 생성
        var startDateStr = "", endDateStr = "";

        if (this.viewType == 'dashboard') {
          startDate = (this.searchParams == undefined) ? Moment() : Moment(this.searchParams.start);
          // 첫날 / 마지막 날 구하기
          startDateStr = Moment(startDate).set('date', 1).format("YYYY-MM-DD");
          endDateStr = Moment(startDate).endOf('month').format("YYYY-MM-DD");
        } else {
          // 메뉴의 화면
          startDate = Moment($(_this.el).find("#FromDatePicker").data("DateTimePicker").getDate());
          endDate = Moment($(_this.el).find("#toDatePicker").data("DateTimePicker").getDate());
          startDateStr = startDate.format('YYYY-MM-DD');
          endDateStr = endDate.format('YYYY-MM-DD');
        }

        var type = "DEPT";
        if (!isDept) {
          type = "PERSON";
        }

        Util.ajaxCall("/statistics/abnormal", "GET", { type: type, fromDate: startDateStr, toDate: endDateStr }).then(function (result) {

          var colKey = ["name", "late", "leave_early", "late_leave_early", "absent", "data_none_1", "data_none_2"];

          for (var i = 0; i < result["DeptSummary"].length; i++) {
            var rowData = result["DeptSummary"][i];
            // 부서 인원 셋팅
            if (isDept) {
              for (var j = 0; j < result["DeptPersionCount"].length; j++) {
                if (rowData.department == result["DeptPersionCount"][j].department) {
                  rowData["total_person"] = result["DeptPersionCount"][j].count;
                  break;
                }
              }
            }

            // 점수 계산
            if (_.isUndefined(rowData["total_person"])) {
              rowData["total_person"] = "1";

            }
            rowData["score"] = (rowData["late"] + rowData["leave_early"] + rowData["late_leave_early"] * 2 +
              rowData["absent"] + rowData["data_none_1"] + rowData["data_none_2"]) / rowData["total_person"];
            rowData["score"] = rowData["score"].toFixed(1);

            for (var colIdx = 0; colIdx < colKey.length; colIdx++) {
              if (_.isUndefined(rowData[colKey[colIdx]]) || rowData[colKey[colIdx]] == 0) {
                rowData[colKey[colIdx]] = "";
              }
            }
          }

          if (isDept) {
            _this.gridOption.column[1].visible = false;
            //_this.gridOption.column[2].visible=true;
            _this.gridOption.column[3].visible = true;

            _this.gridOption.buttons = ["search"];
            //_this.gridOption.order = [[3, "desc"]];
          } else {
            _this.gridOption.column[1].visible = true;
            //_this.gridOption.column[2].visible=false;
            _this.gridOption.column[3].visible = false;

            _this.gridOption.buttons = ["search", {
              type: "myDeptRecord",
              name: "myDeptRecord",
              filterColumn: ["department"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
              tooltip: ""
            }];

            // _this.gridOption.order = [[3, "desc"]];
          }

          _this.gridOption.collection = {
            data: result["DeptSummary"],
            toJSON: function () {
              return result["DeptSummary"];
            }
          };

          if (_this.viewType == 'dashboard') {
            _this.gridOption.scrollFix = false;
          }

          var _gridSchema = Schemas.getSchema('grid');
          _this.grid = new Grid(_gridSchema.getDefault(_this.gridOption));

          _this.option.currentFrom = startDateStr;
          _this.option.currentTo = endDateStr;
        });
      },

      onClickDetailPopup: function (evt) {
        var _this = this;

        var data = JSON.parse($(evt.currentTarget).attr('data'));
        data["fromDate"] = this.option.currentFrom;
        data["toDate"] = this.option.currentTo;

        var deptSummaryDetailPopup = new DeptSummaryDetailPopup(data);
        Dialog.show({
          title: "세부내역 (" + data.dept + ")",
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
    return AbnormalSummaryView;
  });
