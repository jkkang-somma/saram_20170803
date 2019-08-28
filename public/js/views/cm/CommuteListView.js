/**
 * 근태 자료 관리
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'util',
  'resulttimefactory',
  'schemas',
  'grid',
  'dialog',
  'datatables',
  'cmoment',
  'core/BaseView',
  'code',
  'i18n!nls/common',
  'text!templates/default/head.html',
  'text!templates/default/content.html',
  'text!templates/layout/default.html',
  'text!templates/default/row.html',
  'text!templates/default/rowdatepickerRange.html',
  'text!templates/default/rowbuttoncontainer.html',
  'text!templates/default/rowbutton.html',
  'text!templates/default/rowcombo.html',
  'models/sm/SessionModel',
  'models/cm/CommuteModel',
  'models/rm/ApprovalModel',
  'models/rm/ApprovalIndexModel',
  'collection/rm/ApprovalCollection',
  'collection/cm/CommuteCollection',
  'collection/common/HolidayCollection',
  'views/cm/popup/CommuteUpdatePopupView',
  'views/cm/popup/CommentPopupView',
  'views/cm/popup/ChangeHistoryPopupView',
  'views/cm/popup/OvertimeApprovalPopupView'
], function (
  $, _, Backbone, Util, ResultTimeFactory, Schemas, Grid, Dialog, Datatables, Moment, BaseView, Code, i18nCommon,
  HeadHTML, ContentHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, RowComboHTML,
  SessionModel, CommuteModel, ApprovalModel, ApprovalIndexModel, ApprovalCollection, CommuteCollection, HolidayCollection,
  CommuteUpdatePopupView, CommentPopupView, ChangeHistoryPopupView, OvertimeApprovalPopupView) {


    // 출퇴근 시간 셀 생성
    function _createHistoryCell(cellType, cellData, change) {
      var text = null;
      if (cellType == "overtime_code")
        text = Code.getCodeName(Code.OVERTIME, cellData[cellType]);
      else if (cellType == "normal")
        text = _getBrString(Code.getCodeName(Code.WORKTYPE, cellData.work_type));
      else
        text = _getTimeCell(cellData[cellType]);

      if (_.isNull(text)) {
        text = "-";
      }

      if (cellData[change]) {
        var data = JSON.stringify({
          change_column: cellType,
          idx: cellData.idx
        });
        var aHrefStr = "<a class='td-in-out-time' data='" + data + "'  href='-' onclick='return false'>" + text + "</a>";
        return aHrefStr;
      } else {
        return text;
      }

    }
    // 시간 값을 두 줄로 표시 
    function _getTimeCell(time) {
      if (Util.isNotNull(time)) {
        var tArr = time.split(" ");
        if (tArr.length == 2) {
          return tArr[0] + "</br>" + tArr[1];
        } else {
          return time;
        }
      }
      return null;
    }

    function _getTimeStr(min) {

      var hour = Math.floor(min / 60);
      var minute = min % 60;
      var result = "";
      if (min > 0) {
        result += (hour < 10 ? "0" + hour : hour) + ":";
        result += (minute < 10 ? "0" + minute : minute);
      }
      return result;
    }

    function _createCommentCell(cellData) {

      var isShowEditBtn = (SessionModel.get("user").admin == Schemas.ADMIN) ? true : false
      var html1 = '<div><div style="text-align: center;">0 건</div>'; // 코멘트 등록 건수 및 링크
      var html2 = ''; // 코멘트 버튼
      var html3 = '</div?</div>'; // 관리자 기록 수정 버튼

      if (cellData.comment_count > 0) {
        html1 = '<div><div style="text-align: center;">' +
          '<a class="td-comment" data="{idx: ' + cellData.idx + '}" href="#commentmanager/' + cellData.id + '/' + cellData.date + '" ' +
          'target="_blank">' + cellData.comment_count + '건</a></div>';
      }

      html2 = '<div style="text-align: center;">' +
        '<button type="button" class="btn-comment-add btn btn-default btn-xs" data=\'{"idx": ' + cellData.idx + '}\'>' +
        '<span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button>';

      if (isShowEditBtn === true) {
        html3 = '<button type="button" class="btn-commute-edit btn btn-default btn-xs" data=\'{"idx": ' + cellData.idx + '}\'>' +
          '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button></div?</div>'
      }

      return html1 + html2 + html3;
    }

    function _getBrString(result) {
      var resultArr = result.split(/(,|_| )/);
      if (resultArr.length > 1) {
        result = "";
        for (var i = 0; i < resultArr.length; i++) {
          if (i % 2 == 1)
            continue;
          if (i == resultArr.length - 1) {
            result += resultArr[i];
          } else {
            result += resultArr[i] + "<br>";
          }
        }
      }
      return result;
    }

    function _getCommuteUpdateBtn(that) {
      return {
        type: "custom",
        name: "edit",
        tooltip: i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.TOOLTIP,
        click: function (_grid) {
          var selectItem = _grid.getSelectItem();
          _openCommuteUpdatePopup(selectItem, that);
        }
      };
    }

    function timeformat(num) {
      var result = "";
      var hour = Math.floor(num / 60);
      var min = Math.floor(num % 60);

      if (hour < 10) {
        result += "0";
      }
      result += hour + "시간 ";

      if (min < 10) {
        result += "0";
      }

      result += min + "분";

      return result;
    }

    // 근태 수정 팝업 열기
    function _openCommuteUpdatePopup(selectItem, that) {
      if (Util.isNull(selectItem)) {
        Dialog.warning(i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.NOTING_SELECTED);
        return;
      }

      var commuteUpdatePopupView = new CommuteUpdatePopupView(selectItem);
      Dialog.show({
        title: i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.TITLE,
        content: commuteUpdatePopupView,
        buttons: [{
          id: 'updateCommuteBtn',
          cssClass: Dialog.CssClass.SUCCESS,
          label: i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.BUTTON.MODIFY,
          action: function (dialog) {
            commuteUpdatePopupView.updateCommute().done(function (result) {
              // console.log(result);
              var current = result.models[0];
              // var yesterday = result.models[1];
              current.attributes.comment_count = selectItem.comment_count;
              current.set({ idx: selectItem.idx });
              that.grid.updateRow(current.attributes);
              // if(!_.isUndefined(yesterday)){
              // 	var yesterdayRow = that.grid.getRowByFunction(
              // 		function(idx, data, node){
              // 			if(data.date === yesterday.get("date") && data.id === yesterday.get("id")){
              // 				return true;

              // 			}else{
              // 				return false;
              // 			}
              // 		}
              // 	);
              // 	if(yesterdayRow.length > 0){
              // 		yesterday.set({idx : yesterdayRow.data().idx});
              // 		yesterdayRow.data(yesterday.attributes);
              // 	}
              // }
              Dialog.show(i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.MSG.UPDATE_COMPLETE, function () {
                Util.destoryDateTimePicker(true); dialog.close();
              });
            }).fail(function () {

            });
          }
        }, {
          label: i18nCommon.COMMUTE_RESULT_LIST.UPDATE_DIALOG.BUTTON.CANCEL,
          action: function (dialog) {
            Util.destoryDateTimePicker(true); dialog.close();
          }
        }]
      });
    }

    var commuteListView = BaseView.extend({
      el: $(".main-container"),
      elements: {
        defaultId: "",
        defaultDate: ""
      },
      setSearchDate: function (date) {
        this.elements.defaultDate = date;
      },
      initialize: function () {
        var _view = this;
        this.elements.defaultId = SessionModel.getUserInfo().id;
        this.commuteCollection = new CommuteCollection();

        this.gridOption = {
          el: "commute_content",
          id: "commuteDataTable",
          column: [
            { data: "date", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.DATE },
            { data: "department", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.DEPARTMENT },
            { data: "name", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.NAME },
            {
              data: "work_type", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.WORK_TYPE,
              render: function (data, type, full, meta) {
                return _createHistoryCell("normal", full, "normal_change");
              }
            },
            {
              data: "vacation_code", title: i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.VACATION,
              render: function (data, type, rowData, meta) {
                var codeName = Code.getCodeName(Code.OFFICE, data);
                return _.isNull(codeName) ? null : codeName.replace(",", "<br>");
              }
            },
            {
              data: "out_office_code", "title": "외근",
              render: function (data, type, full, meta) {
                return Code.getCodeName(Code.OFFICE, data);
              }
            },
            {
              data: "in_time", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.IN_TIME,
              render: function (data, type, full, meta) {
                return _createHistoryCell("in_time", full, "in_time_change");
              }
            },
            {
              data: "out_time", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.OUT_TIME,
              render: function (data, type, full, meta) {
                return _createHistoryCell("out_time", full, "out_time_change");
              }
            },
            {
              data: "late_time", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.LATE_TIME,
              render: function (data, type, full, meta) {
                return _getTimeStr(data);
              }
            },
            {
              data: "over_time", "title": "초과근무<br>시간 (분)",
              render: function (data, type, full, meta) {
                var result = "-";
                if (data > 0) {
                  var overtime = timeformat(full.over_time);
                  if (!_.isUndefined(full.except) && !_.isNull(full.except)) {
                    overtime = timeformat(full.over_time - full.except);
                  }

                  var isApproval = false;
                  if (full.work_night_falg == "상신") {
                    overtime = overtime + "<BR>(상신중)";
                    isApproval = true;
                  } else if (full.work_night_falg == "상신대기") {
                    overtime = overtime + "<BR>(상신대기)";
                    isApproval = true;
                  }
                  result = _view.getOverTimeCellTemplate(false, overtime);

                  if (full.id == SessionModel.getUserInfo().id) {
                    if (_.isNull(full.overtime_code)) {
                      var date = full.date;
                      if (Moment(_view.overTimeDay).isBefore(date) || Moment(_view.overTimeDay).isSame(date)) {
                        // 휴일,토,일의 경우 버튼이 생성되지 않음. / 외주
                        if (_.indexOf(_view.holidayCollection.pluck("date"), full.date) == -1) {
                          if ((Moment(full.date, "YYYY-MM-DD")).weekday() != 0 && (Moment(full.date, "YYYY-MM-DD")).weekday() != 6) {
                            if (full.over_time >= 120) {	// 최소 120분 이상이 되어야 버튼이 보이도록 한다.
                              result = _view.getOverTimeCellTemplate(true, overtime, full.idx);
                              if (isApproval || SessionModel.get("user").affiliated == 1) {
                                var div = $("<div/>").append(result);
                                div.find(".btn-overtime").css("visibility", "hidden");
                                result = div.html();
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                return result;
              }
            },
            { data: "except", "title": "제외시간 (분)", },
            {
              data: "overtime_code", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.OVERTIME_CODE,
              render: function (data, type, full, meta) {
                return _createHistoryCell("overtime_code", full, "overtime_code_change");
              }
            },
            {
              data: "comment_count", "title": i18nCommon.COMMUTE_RESULT_LIST.GRID_COL_NAME.MEMO,
              render: function (data, type, full, meta) {
                return _createCommentCell(full);
              }
            },
          ],
          rowCallback: function (row, data) {
            if (data.work_type == 21 || data.work_type == 22) { // 결근 처리
              $(row).addClass("absentce");
            } else if (_view.elements.defaultDate === data.date && _view.elements.defaultId === data.id) {
              $(row).addClass("target");
            } else {
              $(row).removeClass("absentce");
            }
          },
          collection: this.commuteCollection,
          dataschema: ["date", "department", "name", "work_type_name", "vacation_name", "out_office_name", "overtime_pay", "late_time", "over_time", "in_time", "out_time", "comment_count", "normal_change"],
          detail: true,
          buttons: ["search"],
          fetch: false,
          order: [[1, "asc"], [2, "asc"], [3, "asc"]]
        };

        if (SessionModel.getUserInfo().admin >= Schemas.DEPT_BOSS) {
          this.gridOption.buttons.push({ type: "myRecord", name: "myRecord", filterColumn: ["name"], tooltip: "" })
        }
        this.buttonInit();
      },

      beforeDestroy: function() {
        Util.destoryDateTimePicker(false);
      },

      events: {
        'click #ccmSearchBtn': 'onClickSearchBtn',
        'click #commuteDataTable .td-in-out-time': 'onClickOpenChangeHistoryPopup',
        'click #commuteDataTable .btn-comment-add': 'onClickOpenInsertCommentPopup',
        'click #commuteDataTable .btn-commute-edit': 'onClickOpenUpdateCommutePopup',
        'click #commuteDataTable .btn-overtime': 'onClickOpenOvertimePopup'
      },
      buttonInit: function () {
        var that = this;
        // tool btn
        // if (SessionModel.get("user").admin == Schemas.ADMIN ) {
        // 	this.gridOption.buttons.push(_getCommuteUpdateBtn(that));
        // }
      },
      render: function () {
        //var _view=this;
        var _headSchema = Schemas.getSchema('headTemp');
        var _headTemp = _.template(HeadHTML);
        var _layOut = $(LayoutHTML);
        var _head = $(_headTemp(_headSchema.getDefault(
          {
            title: i18nCommon.COMMUTE_RESULT_LIST.TITLE,
            subTitle: i18nCommon.COMMUTE_RESULT_LIST.SUB_TITLE
          }
        )));

        _head.addClass("no-margin");
        _head.addClass("relative-layout");

        var _row = $(RowHTML);
        var _datepickerRange = $(_.template(DatePickerHTML)(
          {
            obj:
            {
              fromId: "ccmFromDatePicker",
              toId: "ccmToDatePicker"
            }
          })
        );
        var _btnContainer = $(_.template(RowButtonContainerHTML)({
          obj: {
            id: "ccmBtnContainer"
          }
        })
        );

        var _searchBtn = $(_.template(RowButtonHTML)({
          obj: {
            id: "ccmSearchBtn",
            label: i18nCommon.COMMUTE_RESULT_LIST.SEARCH_BTN,
          }
        })
        );
        var _combo = $(_.template(RowComboHTML)({
          obj: {
            id: "ccmCombo",
            label: "부서"
          }
        })
        );
        _btnContainer.append(_searchBtn);

        _row.append(_datepickerRange);
        if (SessionModel.getUserInfo().admin >= Schemas.DEPT_BOSS) {
          _row.append(_combo);
        }
        _row.append(_btnContainer);
        var _content = $(ContentHTML).attr("id", this.gridOption.el);


        _layOut.append(_head);
        _layOut.append(_row);
        _layOut.append(_content);


        $(this.el).html(_layOut);

        var startDate = "", endDate = "";
        if (this.elements.defaultDate.length !== 0) {
          var targetDate = new Moment(this.elements.defaultDate);
          if (targetDate.isValid()) {
            // 김은영 대리의 경우 대시보드에서 날짜 지정 클릭 시 1일만 보여줌.
            if (SessionModel.getUserInfo().id == "130702") {
              startDate = endDate = targetDate;
            } else {
              startDate = Moment(targetDate).add(-5, "days").format("YYYY-MM-DD");
              endDate = Moment(targetDate).add(3, "days").format("YYYY-MM-DD");
            }
          }
        }
        if (endDate === "") {
          var today = new Date();
          startDate = Moment(today).add(-7, "days").format("YYYY-MM-DD");
          endDate = Moment(today).format("YYYY-MM-DD");
        }

        $(this.el).find("#ccmFromDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          defaultDate: startDate
        });

        $(this.el).find("#ccmToDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          defaultDate: endDate
        });

        var dept = Code.getCodes(Code.DEPARTMENT);
        $(this.el).find("#ccmCombo").append("<option>" + "전체" + "</option>");
        for (var i = 0; i < dept.length; i++) {
          if (dept[i].name != "임원" && dept[i].name != "무소속")
            $(this.el).find("#ccmCombo").append("<option>" + dept[i].name + "</option>");
        }


        if (SessionModel.getUserInfo().id == "130702" || SessionModel.getUserInfo().dept_name == "임원")
          $(this.el).find("#ccmCombo").val("전체");
        else
          $(this.el).find("#ccmCombo").val(SessionModel.getUserInfo().dept_name);

        var _view = this;
        this.holidayCollection = new HolidayCollection();
        this.holidayCollection.fetch({
          data: {
            year: Moment().year()
          }
        }).done(function () {
          _view.overTimeDay = Util.getApprovalLimitDate(_view.holidayCollection)
          var _gridSchema = Schemas.getSchema('grid');
          _view.grid = new Grid(_gridSchema.getDefault(_view.gridOption));
          _view.grid.render();
          _view.selectCommute();
        });

        return this;
      },
      onClickSearchBtn: function (evt) {
        this.selectCommute();
      },
      onClickOpenInsertCommentPopup: function (evt) {
        var data = JSON.parse($(evt.currentTarget).attr('data'));
        // 0부터 시작
        var selectItem = this.grid.getDataAt(data.idx - 1);

        var commentPopupView = new CommentPopupView(selectItem);
        var that = this;
        Dialog.show({
          title: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.TITLE,
          content: commentPopupView,
          buttons: [{
            id: 'updateCommuteBtn',
            cssClass: Dialog.CssClass.SUCCESS,
            label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.BUTTON.ADD,
            action: function (dialog) {
              commentPopupView.insertComment({
                success: function (model, response) {
                  // 결재상신
                  selectItem.comment_count++;	 // comment 수 증가 
                  that.grid.updateRow(selectItem, selectItem.idx - 1);	// index 0부터 시작 

                  selectItem = that.grid.getDataAt(data.idx - 1);
                  var inputData = commentPopupView.getData();
                  inputData.intime = (inputData.inTimeAfter != "") ? inputData.inTimeAfter : inputData.inTimeBefore;
                  inputData.outtime = (inputData.outTimeAfter != "") ? inputData.outTimeAfter : inputData.outTimeBefore;

                  if (inputData.approvalOvertime) {
                    // resultTimeFacctory. initByModel 활용하여 데이터 가져오기 
                    var resultTimeFacctory = ResultTimeFactory.Builder();
                    // 1. model 생성
                    var commM = new CommuteModel(selectItem);
                    commM.set('except', inputData.except);
                    commM.set('in_time', inputData.intime);
                    commM.set('out_time', inputData.outtime);
                    // 2. 해당 model로 
                    // resultTimeFacctory.initByModel(commM);
                    resultTimeFacctory.setNewModelData(commM).done(function (overTimeResult) {
                      that.sendApprovalOvertime(dialog, _.extend(selectItem, overTimeResult), inputData, "상신대기");
                    });
                    //console.log(overTimeResult);

                  } else {
                    Dialog.show(i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.MSG.COMMENT_ADD_COMPLETE, function () {
                      Util.destoryDateTimePicker(true); dialog.close();
                      // that.grid.updateRow(selectItem, selectItem.idx -1 );	// index 0부터 시작 
                    });
                  }

                }, error: function (model, res) {
                  if (res.fail().responseJSON && res.fail().responseJSON.message) {
                    Dialog.show("이미 상신 또는 처리중인 코멘트가 있습니다.\n상신중인 경우 상신 취소 후 다시 등록하세요.");
                  } else {
                    Dialog.show(i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.MSG.COMMENT_ADD_FAIL);
                  }
                }
              });
            }
          }, {
            label: i18nCommon.COMMUTE_RESULT_LIST.COMMENT_DIALOG.BUTTON.CANCEL,
            action: function (dialog) {
              Util.destoryDateTimePicker(true); dialog.close();
            }
          }]
        });
      },
      onClickOpenUpdateCommutePopup: function (evt) {	// 근태 수정 팝업 
        var data = JSON.parse($(evt.currentTarget).attr('data'));
        // 0부터 시작
        var selectItem = this.grid.getDataAt(data.idx - 1);
        _openCommuteUpdatePopup(selectItem, this);
      },
      onClickOpenChangeHistoryPopup: function (evt) {
        var data = JSON.parse($(evt.currentTarget).attr('data'));
        var selectItem = this.grid.getDataAt(data.idx - 1); // 0부터 시작
        var searchData = {
          id: selectItem.id,
          year: selectItem.year,
          date: selectItem.date,
          name: selectItem.name,
          change_column: data.change_column
        };

        var changeHistoryPopupView = new ChangeHistoryPopupView(searchData);
        var title = "";
        switch (data.change_column) {
          case "in_time":
            //title = i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.TITLE_IN;       
            title = i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.TITLE_IN + " - " + searchData.name + " ( " + searchData.date + " )";
            break;
          case "out_time":
            title = i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.TITLE_OUT + " - " + searchData.name + " ( " + searchData.date + " )";
            break;
          case "overtime_code":
            title = i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.TITLE_OVER + " - " + searchData.name + " ( " + searchData.date + " )";
            break;
          case "normal":
            title = "근태 정상 처리 내역" + " - " + searchData.name + " ( " + searchData.date + " )";
            break;
        }
        Dialog.show({
          title: title,
          content: changeHistoryPopupView,
          buttons: [{
            label: i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.BUTTON.CANCEL,
            action: function (dialog) {
              Util.destoryDateTimePicker(true); dialog.close();
            }
          }]
        });
      },

      onClickOpenOvertimePopup: function (evt) {
        var index = $(evt.currentTarget).attr('data');
        var selectItem = this.grid.getDataAt(index - 1); // 0부터 시작
        var overtimeApprovalPopupView = new OvertimeApprovalPopupView(selectItem);

        // console.log("grid data", selectItem);
        var _this = this;
        var clickFlag = false;
        Dialog.show({
          title: "초과근무 결재",
          content: overtimeApprovalPopupView,
          buttons: [{
            label: "상신",
            cssClass: Dialog.CssClass.SUCCESS,
            action: function (dialog) {
              if (clickFlag) {
                console.log("IN skip");
                return;
              }
              clickFlag = true;

              var inputData = overtimeApprovalPopupView.getData();
              // console.log(inputData);

              var checkTime = selectItem.over_time - inputData.except;
              if (checkTime < 120) {
                Dialog.error("초과근무 시간이 유효하지 않습니다.");
                clickFlag = false;
                return;
              }

              if (inputData["overtimeReason"] == "") {
                Dialog.warning("사유를 입력하여 주시기 바랍니다.");
                return null;
              }
              _this.sendApprovalOvertime(dialog, selectItem, inputData);

            }
          }, {
            label: i18nCommon.COMMUTE_RESULT_LIST.CHANGE_HISTORY_DIALOG.BUTTON.CANCEL,
            action: function (dialog) {
              Util.destoryDateTimePicker(true); dialog.close();
            }
          }]
        });
      },
      getzFormat: function (s, len) {
        var sZero = "";
        s = s + "";
        if (s.length < len) {
          for (var i = 0; i < (len - s.length); i++) {
            sZero += "0";
          }
        }
        return sZero + s;
      },

      getOverTimeCellTemplate: function (isMod, overTime, idx) {
        if (isMod === false) {
          return '<div> <div style="text-align: center;"> ' + overTime + '</div></div>';
        } else {
          return '<div> <div style="text-align: center;"> ' + overTime +
            '<button type="button" class="btn-overtime btn btn-default btn-xs" data="' + idx + '">' +
            '<span class="glyphicon glyphicon-edit" aria-hidden="true"></span>' +
            '</button>' +
            '</div></div>';
        }
      },

      sendApprovalOvertime: function (dialog, selectItem, inputData, state) {
        var _this = this;
        var comment = inputData.overtimeReason;
        comment = comment.replace(/,/gi, '<comma>');
        var data = {
          day_count: 0,
          decide_comment: "",
          end_date: selectItem.date,
          end_time: "",
          manager_id: SessionModel.getUserInfo().approval_id,
          office_code: "O01",
          start_date: selectItem.date,
          start_time: "",
          submit_comment: parseInt(inputData.except, 10) + "," + selectItem.over_time + "," + inputData.intime + "," + inputData.outtime + ',' + comment,
          submit_id: SessionModel.getUserInfo().id
        };

        if (state != undefined) {
          data["state"] = state;
        }

        var yearMonth = "";

        // getzFormat
        var nowDate = new Date();
        yearMonth = nowDate.getFullYear() + _this.getzFormat(nowDate.getMonth() + 1, 2);

        var docData = {
          yearmonth: yearMonth
        };

        var _appCollection = new ApprovalCollection();
        _appCollection.url = "/approval/appIndex";

        _appCollection.fetch({
          reset: true,
          data: docData,
          error: function (result) {
            Dialog.error("데이터 조회가 실패했습니다.");
            Util.destoryDateTimePicker(true); dialog.close();
            _this.clickFlag = false;
          }
        }).done(function (result) {
          docData["seq"] = result[0].maxSeq;
          var _approvalIndexModel = new ApprovalIndexModel(docData);
          _approvalIndexModel.save({}, {
            success: function (model, xhr, options) {
              var _seq = model.attributes.seq;
              _seq = (_seq == null) ? 1 : _seq + 1;
              var doc_num = docData.yearmonth + "-" + _this.getzFormat(_seq, 3);
              data["doc_num"] = doc_num;

              var _approvalModel = new ApprovalModel(data);
              _approvalModel.save({}, {
                success: function (model, xhr, options) {
                  Dialog.show("결재가 상신되었습니다.");
                  selectItem.work_night_falg = (state != undefined) ? state : "상신";
                  _this.grid.updateRow(selectItem);
                  Util.destoryDateTimePicker(true); dialog.close();
                },
                error: function (model, xhr, options) {
                  var respons = xhr.responseJSON;
                  Dialog.error(respons.message);
                  Util.destoryDateTimePicker(true); dialog.close();
                },
                wait: false
              });
            },
            error: function (model, xhr, options) {
              var respons = xhr.responseJSON;
              Dialog.error(respons.message);
              Util.destoryDateTimePicker(true); dialog.close();
              _this.clickFlag = false;
            },
            wait: false
          });
        });
      },

      selectCommute: function () {
        var data = {
          startDate: Moment($(this.el).find("#ccmFromDatePicker").data("DateTimePicker").getDate()),
          endDate: Moment($(this.el).find("#ccmToDatePicker").data("DateTimePicker").getDate()),
          dept: $(this.el).find("#ccmCombo").val()
        };

        if (data.startDate.isAfter(data.endDate)) {
          Dialog.warning("시작일자가 종료일자보다 큽니다.");
          return;
        }

        if (data.endDate.diff(data.startDate, 'days') > 92) {
          Dialog.warning("검색 기간이 초과되었습니다. (최대 3개월)");
          return;
        }

        data.startDate = data.startDate.format("YYYY-MM-DD");
        data.endDate = data.endDate.format("YYYY-MM-DD");

        var _this = this;
        Dialog.loading({
          action: function () {
            var dfd = new $.Deferred();
            _this.commuteCollection.fetch({
              data: data,
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
            Dialog.error(i18nCommon.COMMUTE_RESULT_LIST.MSG.GET_DATA_FAIL);
          },
        });


      }
    });
    return commuteListView;
  });