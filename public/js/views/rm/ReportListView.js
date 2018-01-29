define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'animator',
    'core/BaseView',
    'grid',
    'schemas',
    'dialog',
    'cmoment',
    'code',
    'models/sm/SessionModel',
    'text!templates/report/commuteListTemplete.html',
    'collection/rm/ApprovalCollection',
    'collection/vacation/VacationCollection',
    'collection/common/HolidayCollection',
    'views/rm/AddNewReportView',
    'views/rm/ApprovalReportView',
    'views/rm/DetailReportView',
], function($, _, Backbone, Util, animator, BaseView, Grid, Schemas, Dialog, Moment, Code,
    SessionModel,
    commuteListTmp,
    ApprovalCollection, VacationCollection, HolidayCollection,
    AddNewReportView, ApprovalReportView, DetailReportView
) {
    var _reportListView = 0;
    var reportListView = BaseView.extend({
        el: $(".main-container"),
        // holidayInfos: [],

        events: {
            "click #commuteManageTbl tbody tr": "onSelectRow",
            "click #btnCommuteSearch": "onClickSearchBtn",
            "click #btnManagerSearch": "onClickManagerSearchBtn",
            "click .list-approval-btn": "onClickListApprovalBtn",
            "click .list-detail-btn": "onClickListDetailBtn",
            "click .list-delete-btn": "onClickListDeleteBtn"
        },

        initialize: function() {
            var _id = "reportListView_" + (_reportListView++);
            this.collection = new ApprovalCollection();

            // 휴가
            // this.setVacationById();
            // 휴일
            // this.setHolidayInfos();

            this.option = {
                el: _id + "_content",
                column: [],
                dataschema: ["submit_date", "submit_dept_code", "submit_name", "office_code_name", "commute_date", "commute_time", "decide_date", "state", "black_mark"],
                collection: this.collection,
                detail: true,
                view: this
                    //gridOption
            };

            $(this.el).html('');
            $(this.el).empty();
        },

        render: function() {
            $(this.el).html(commuteListTmp);
            $(this.el).find(".content").attr({
                "id": this.option.el
            });

            // title setting
            this.setTitleTxt();
            // datePickerPop setting
            this.setDatePickerPop();
            // button Setting
            this.setBottomButtonCon();
            // table setting
            this.initReportTable();
            this.setReportTable();
        },

        setTitleTxt: function() {
            // small title 
            var smallTitleTxt = $(this.el).find('#smallTitleTxt');
            smallTitleTxt.empty();
            smallTitleTxt.text('근태 결재 관리');

            return this;
        },

        setBottomButtonCon: function() {
            var _this = this;
            var sessionInfo = SessionModel.getUserInfo();
            if (sessionInfo.privilege <= 2) {
                // 결재 가능 id
                $(_this.el).find('#btnManagerSearch').css('display', 'inline-block');
            }
            else {
                $(_this.el).find('#btnManagerSearch').css('display', 'none');
            }

            return this;
        },
        
        setDatePickerPop: function() {
            var today = new Date();
            var firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            var lastDay = new Date(today.getFullYear() + 1, today.getMonth() - 1, 1);
          
            if(this.settingParam != undefined){
                firstDay = new Date(this.settingParam.start);
                lastDay = new Date(this.settingParam.end);
            }

            var beforeDate = $(this.el).find("#beforeDate");
            this.beforeDate = beforeDate.datetimepicker({
                pickTime: false,
                language: "ko",
                todayHighlight: true,
                format: "YYYY-MM-DD",
                autoclose: true,
                defaultDate: Moment(firstDay).format("YYYY-MM-DD")
            });

            var afterDate = $(this.el).find("#afterDate");
            this.afterDate = afterDate.datetimepicker({
                pickTime: false,
                language: "ko",
                todayHighlight: true,
                format: "YYYY-MM-DD",
                defaultDate: Moment(new Date(lastDay - 1)).format("YYYY-MM-DD")
            });
        },

        setSearchParam : function(data){
            console.log(data)
        },

        setReportTable: function(val, managerMode) {
            var formData = this.getSearchData(val, managerMode);

            var _this = this;
            
			Dialog.loading({
                action:function(){
					var dfd = new $.Deferred();
					_this.collection .fetch({ 
						data: formData,
						success: function(result) {
							dfd.resolve();
						},
						error : function(result) {
							dfd.reject();
						}
					}); 
            	    return dfd.promise();
        	    },
        	    
                actionCallBack:function(res){//response schema
					_this.grid.render();
				},
                errorCallBack:function(response){
                    Dialog.error("데이터 조회가 실패했습니다.");
                },
            });
        },

        initReportTable: function() {
            var view = this;
            this.option.column = [{
                title: "신청일자",
                render: function(data, type, row) {
                    var dataVal = view.getDateFormat(row.submit_date);
                    return dataVal;
                }
            }, {
                title: "부서",
                data: "submit_dept_code",
                render: function(data, type, row) {
                    return Code.getCodeName(Code.DEPARTMENT, data);
                }
            }, {
                title: "이름",
                "data": "submit_name",
            }, {
                
                title: "구분",
                "data": "office_code_name",
            }, {
                title: "근태일수",
                render: function(data, type, row) {
                    var dataVal = (row.day_count != null && row.day_count != 0) ? "<span class='float_right'>" + row.day_count + "일</span>" : "<span style='float: right;'>-</span>";
                    return dataVal;
                }
            }, {
                title: "근태기간",
                render: function(data, type, row) {
                    var dataVal = "";

                    if (row.start_date == row.end_date && row.day_count != null) {
                        dataVal = row.start_date;
                    }
                    else {
                        dataVal = row.start_date + "</br>~ " + row.end_date;
                    }
                    
                    return dataVal;
                }
            }, {
                title: "외근시간",
                render: function(data, type, row) {
                    var dataVal = row.start_time + "</br>~ " + row.end_time;
                    if (row.start_time == null || row.office_code != 'W01') {
                        dataVal = "-";
                    }
                    return dataVal;
                }
            }, {
                data: "manager_name",
                title: "결재자"
            }, {
                title: "처리일자",
                render: function(data, type, row) {
                    var dataVal = view.getDateFormat(row.decide_date);
                    return dataVal;
                }
            }, {
                title: "처리상태",
                render: function(data, type, row) {
                    // data : "black_mark",
                    // ( 1:정상, 2:당일결재, 3:익일결재, 4:당일상신, 5:익일상신
                    var sessionInfo = SessionModel.getUserInfo();
                    var dataVal = "<div style='text-align: center;'>" + row.state + "</div>";
                    dataVal += "<div style='text-align: center;'>";
                    // if(sessionInfo.id == row.manager_id && row.state != '결재완료' 
                    //               && row.state != '취소완료' && row.state != '상신취소'){
                    if (sessionInfo.id == row.manager_id &&
                        (row.state == '상신' || row.state == '취소요청')) {
                        dataVal += "<button class='btn list-approval-btn btn-default btn-xs' id='btnApproval" + row.doc_num + "'><span class='glyphicon glyphicon-ok' aria-hidden='true'></span></button>";
                    }
                    dataVal += "<button class='btn list-detail-btn btn-default btn-xs' id='btnDetail" + row.doc_num + "'><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button>";
                    dataVal += "</div>";
                    return dataVal;
                }
            }, {
                title: "비고",
                render: function(data, type, row) {
                    // data : "black_mark",
                    // ( 1:정상, 2:당일결재, 3:익일결재
                    var dataVal = "-";
                    if(row.office_code != "O01"){
                        switch (row.black_mark) {
                            case '1':
                                dataVal = "정상";
                                break;
                            case '2':
                                dataVal = "당일결재";
                                break;
                            case '3':
                                dataVal = "익일결재";
                                break;
                            case '4':
                                dataVal = '당일상신';
                                break;
                            case '5':
                                dataVal = '익일상신';
                                break;
                            default:
                                dataVal = "-";
                        }
                    }
                    return dataVal;
                    
                }
            }];

            this.option.fetch = false;
            this.option.buttons = this.setTableButtons();
            var _gridSchema = Schemas.getSchema('grid');
            this.grid = new Grid(_gridSchema.getDefault(this.option));
            this.grid.render();

            return this;
        },

        setTableButtons: function() {
            var _this = this;
            var _buttons = ["search", {
                type: "myRecord",
                name: "myRecord",
                filterColumn: ["submit_name", "manager_name"], //필터링 할 컬럼을 배열로 정의 하면 자신의 아이디 또는 이름으로 필터링 됨. dataschema 에 존재하는 키값.
                tooltip: "",
            }];

            _buttons.push({ // 신규상신
                type: "custom",
                name: "add",
                tooltip: "신규 상신",
                click: function(_grid) {
                    // location.href = '#reportmanager/add';
                    var _addNewReportView = new AddNewReportView();
                    // var selectData = {};
                    // selectData.total_day = _this.total_day;
                    // selectData.used_holiday = _this.used_holiday;
                    // selectData.holidayInfos = _this.holidayInfos;
                    // _addNewReportView.options = selectData;
                    Dialog.show({
                        title: "결재 상신",
                        content: _addNewReportView,
                        buttons: [{
                            label: "상신",
                            cssClass: Dialog.CssClass.SUCCESS,
                            action: function(dialogRef) { // 버튼 클릭 이벤트
                                _addNewReportView.onClickBtnSend(dialogRef).done(function(model) {
                                    _this.onClickClearBtn();
                                    dialogRef.close();
                                });
                            }
                        }, {
                            label: '닫기',
                            action: function(dialogRef) {
                                dialogRef.close();
                            }
                        }]
                    });
                }
            });

            // _buttons.push({ // 결재
            //     type: "custom",
            //     name: "ok",
            //     tooltip: "결재",
            //     click: function(_grid) {
            //         var selectData = _this.grid.getSelectItem();
            //         _this.onClickApproval(selectData);
            //     }
            // });
            // _buttons.push({ // detail
            //     type: "custom",
            //     name: "read",
            //     tooltip: "상세 보기",
            //     click: function(_grid) {
            //         var selectData = _this.grid.getSelectItem();
            //         _this.onClickDetail(selectData);
            //     }
            // });
            if (this.actionAuth.save) {
                _buttons.push({ // detail
                    type: "custom",
                    name: "save",
                    tooltip: "저장하기",
                    click: function(_grid) {
                        _this.onClickSave(_this.grid);
                    }
                });
            };
            return _buttons;
        },

        // setVacationById: function() {
        //     var _this = this;
        //     var today = new Date();
        //     var sYear = today.getFullYear() + "";
        //     var sessionInfo = SessionModel.getUserInfo();
        //     var _vacationColl = new VacationCollection();
        //     _vacationColl.url = '/vacation/list';
        //     _vacationColl.fetch({
        //         data: {
        //             id: sessionInfo.id,
        //             year: sYear
        //         },
        //         error: function(result) {
        //             Dialog.error("데이터 조회가 실패했습니다.");
        //         }
        //     }).done(function(result) {
        //         if (result.length > 0) {
        //             _this.total_day = result[0].total_day;
        //             _this.used_holiday = result[0].used_holiday;
        //         }
        //     });
        // },

        // setHolidayInfos: function() {
        //     var _this = this;
        //     var today = new Date();
        //     var sYear = today.getFullYear() + "";

        //     var _holiColl = new HolidayCollection();
        //     _holiColl.fetch({
        //         data: {
        //             year: sYear
        //         },
        //         error: function(result) {
        //             Dialog.error("데이터 조회가 실패했습니다.");
        //         }
        //     }).done(function(result) {
        //         if (result.length > 0) {
        //             _this.holidayInfos = result;
        //         }
        //         else {
        //             _this.holidayInfos = [];
        //         }
        //     });

        // },

        getDateFormat: function(dateData) {

            if (!_.isNull(dateData)) {
                var time = Moment(dateData).format("YYYY-MM-DD HH:mm:ss");
                var tArr = time.split(" ");
                if (tArr.length == 2) {
                    return tArr[0] + "</br>" + tArr[1];
                }
            }
            return "-";
            // var d = new Date(dateData);
            // var sDateFormat = "";
            // if (dateData == null){
            //   sDateFormat = "-";
            // }else {
            //   sDateFormat
            //   = d.getFullYear() + "-" + this.getzFormat(d.getMonth() + 1, 2) + "-" + this.getzFormat(d.getDate(), 2)
            //   + " " + this.getzFormat(d.getHours(), 2) + ":" + this.getzFormat(d.getMinutes(), 2) + ":" + this.getzFormat(d.getSeconds(), 2);
            // }
            // return sDateFormat;
        },

        // getzFormat: function(s, len){
        //   var sZero = "";
        //   s = s + "";
        //   if(s.length < len){
        //     for(var i = 0; i < (len-s.length); i++){
        //       sZero += "0";
        //     }
        //   }
        //   return sZero + s;
        // },

        getSearchData: function(val, managerMode) {
            var data = {};

            var startDate = this.beforeDate.find("input").val();
            var endDate = this.afterDate.find("input").val();
            //var endDate=//this.afterDate.data("DateTimePicker").getDate().format("YYYY-MM-DD");
            // Dialog.error(this.afterDate.data("DateTimePicker").getText());

            if (val && (startDate == "" || endDate == "")) {
                data["msg"] = "기간을 모두 입력 해주세요.";
                return data;
            }
            else {
                var start = new Date(startDate);
                var end = new Date(endDate);

                if (val && (start > end)) {
                    data["msg"] = "기간을 잘못 입력 하였습니다.";
                    return data;
                }
                else {
                    data["startDate"] = startDate;
                    data["endDate"] = endDate;
                }

                // privilege &lt;= 2
                var sessionInfo = SessionModel.getUserInfo();
                if ((managerMode && sessionInfo.privilege <= 2)
                    || this.settingParam != undefined) {
                    // 결재 가능 id
                    data["managerId"] = sessionInfo.id;
                }
            }

            return data;
        },

        onSelectRow: function(evt) {

            var $currentTarget = $(evt.currentTarget);
            if ($currentTarget.hasClass('selected')) {
                $currentTarget.removeClass('selected');
            }
            else {
                $(this.el).find('#commuteManageTbl tr.selected').removeClass('selected');
                $currentTarget.addClass('selected');
            }
        },

        onClickSearchBtn: function(evt) {
            var data = this.getSearchData(true, false);

            if (data["msg"] != undefined && data["msg"] != "") {
                Dialog.error(data["msg"]);
            }
            else {
                this.setReportTable(true, false);
            }
        },
        // onClickManagerSearchBtn
        onClickManagerSearchBtn: function(evt) {
            var data = this.getSearchData(true, true);

            if (data["msg"] != undefined && data["msg"] != "") {
                Dialog.error(data["msg"]);
            }
            else {
                this.setReportTable(true, true);
            }
        },
        onClickClearBtn: function(evt) {
            this.render();
        },
        onClickListApprovalBtn: function(evt) {
            evt.stopPropagation();
            var $currentTarget = $(evt.currentTarget.parentElement.parentElement.parentElement);
            $('.selected').removeClass('selected');
            $currentTarget.addClass('selected');
            var selectData = this.grid.getSelectItem();
            this.onClickApproval(selectData);
        },
        onClickApproval: function(selectData) {
            var _this = this;
            // var selectData=_this.grid.getSelectItem();
            if (Util.isNotNull(selectData)) {
                // selectData.holidayInfos = _this.holidayInfos;
                var sessionInfo = SessionModel.getUserInfo();

                if (selectData.state == "상신" || selectData.state == "취소요청") {
                    //if(true){
                    if (selectData.manager_id == sessionInfo.id) {
                        //if(true){
                        var _approvalReportView = new ApprovalReportView();
                        // data param 전달
                        _approvalReportView.options = selectData;
                        // Dialog
                        Dialog.show({
                            title: "결재",
                            content: _approvalReportView,
                            buttons: [{
                                label: "확인",
                                cssClass: Dialog.CssClass.SUCCESS,
                                action: function(dialogRef) { // 버튼 클릭 이벤트
                                    var _appCollection = new ApprovalCollection();
                                    _appCollection.url = "/approval/info";
                                    var _thisData = {
                                        doc_num: selectData.doc_num
                                    };
                                    _appCollection.fetch({
                                            reset: true,
                                            data: _thisData,
                                            error: function(result) {
                                                Dialog.error("데이터 조회가 실패했습니다.");
                                                _this.thisDfd.reject();
                                            }
                                        })
                                        .done(function(result) {
                                            if (result.length != 0) {
                                                _approvalReportView.onClickBtnSend(dialogRef).done(function(model) {
                                                    Dialog.show("완료되었습니다.");
                                                    _this.grid.updateRow(model);
                                                    dialogRef.close();
                                                }).fail(function() {
                                                    Dialog.error("해당 날짜에 이미 결재된 내역이 있습니다.");
                                                });
                                            }
                                            else {
                                                _this.setReportTable(true, false);
                                                Dialog.error("상신이 취소된 항목입니다.");
                                                dialogRef.close();
                                            }
                                        });

                                }
                            }, {
                                label: '닫기',
                                action: function(dialogRef) {
                                    dialogRef.close();
                                }
                            }]
                        });
                    }
                    else {
                        Dialog.warning("해당 상신 항목의 결재자가 아닙니다.");
                    }

                }
                else {
                    Dialog.warning("결재 완료된 항목입니다.");
                }

            }
            else {
                Dialog.error("결재 대상을 선택해주세요.");
            }

        },
        onClickListDetailBtn: function(evt) {
            evt.stopPropagation();
            var $currentTarget = $(evt.currentTarget.parentElement.parentElement.parentElement);
            $('.selected').removeClass('selected');
            $currentTarget.addClass('selected');
            var selectData = this.grid.getSelectItem();
            this.onClickDetail(selectData);
        },
        onClickDetail: function(selectData) {
            var _this = this;
            // var selectData=_this.grid.getSelectItem();
            if (Util.isNotNull(selectData)) {
                // selectData.holidayInfos = _this.holidayInfos;
                var _detailReportView = new DetailReportView();
                // data param 전달
                _detailReportView.options = selectData;

                var dialogButtons = [];
                var sessionInfo = SessionModel.getUserInfo();
                if (selectData.submit_id == sessionInfo.id && selectData.state == '결재완료') {
                    dialogButtons.push({
                        label: "취소 요청",
                        cssClass: Dialog.CssClass.SUCCESS,
                        action: function(dialogRef) { // 버튼 클릭 이벤트
                            Dialog.confirm({
                                // msg:"Do you want to cancel approval?", 
                                msg: "상신된 결재를 취소 요청하시겠습니까?",
                                action: function() {
                                    var _dfd = new $.Deferred();
                                    _detailReportView.onClickBtnAppCancel('취소요청').done(function(model) {
                                        Dialog.show("결재상신이 취소되었습니다.");
                                        _this.grid.updateRow(model);
                                        // _this.onClickClearBtn();
                                        dialogRef.close();
                                    });
                                    // this.action.caller.arguments[0].close();
                                    _dfd.resolve();
                                    return _dfd.promise();
                                }
                            });
                        }
                    });
                }
                if (selectData.submit_id == sessionInfo.id && selectData.state == '상신') {
                    dialogButtons.push({
                        label: "상신 취소",
                        cssClass: Dialog.CssClass.SUCCESS,
                        action: function(dialogRef) { // 버튼 클릭 이벤트

                            var canceldd = Dialog.confirm({
                                msg: "해당 결재를 취소하시겠습니까?",
                                // msg:"Do you want to cancel this report?", 
                                action: function() {
                                    var _dfd = new $.Deferred();
                                    _detailReportView.onClickBtnAppCancel('상신취소').done(function(model) {
                                        Dialog.show("취소 요청이 완료되었습니다.");
                                        _this.grid.updateRow(model);
                                        dialogRef.close();
                                    }).fail(function(failReason) {
                                        if (failReason.div_fail) {
                                            _this.setReportTable(true, false);
                                            dialogRef.close();
                                        }
                                    });
                                    _dfd.resolve();
                                    return _dfd.promise();
                                }
                            });
                        }
                    });
                }
                dialogButtons.push({
                    label: "확인",
                    cssClass: Dialog.CssClass.SUCCESS,
                    action: function(dialogRef) { // 버튼 클릭 이벤트
                        dialogRef.close();
                    }
                });

                // Dialog
                Dialog.show({
                    title: "상세보기",
                    content: _detailReportView,
                    buttons: dialogButtons
                });
            }
            else {
                Dialog.error("항목을 선택해주세요.");
            }

        },
        onClickSave: function(grid) {
            grid.saveExcel();
        }

    });
    return reportListView;
});