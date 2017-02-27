define([ 
    'jquery',
    'underscore',
    'backbone',
    'cmoment',
    'util',
    'i18n!nls/common',
    'lib/component/form',
    'dialog',
    'comboBox',
    'models/sm/SessionModel',
    'models/room/RoomModel',
    'models/room/RoomRegModel',
    'collection/room/RoomRegCollection',
    'text!templates/default/datepicker.html',
    'text!templates/room/addRoomRegPopup.html',
], function(
    $, _, Backbone, Moment, Util, i18nCommon, Form, Dialog,
    ComboBox,
    SessionModel,
    RoomModel,
    RoomRegModel,
    RoomRegCollection,
    DatePickerHTML,
    addRoomRegTmp
) {
    var EditRoomRegPopupView = Backbone.View.extend({
        elements:{
            _regModel : null
        },
        initialize : function(roomReserveV) {
            this.roomReserveView = roomReserveV;
            this.elements._regModel = null;
        },
        
        render : function(el) {
            var dfd= new $.Deferred();
            var _this = this;
            this.el = el;

            $(this.el).append(addRoomRegTmp);

            var isMy = false;

            // 예약자 표시
            if ( this.elements._regModel != null ) {
                $(this.el).find("#submit_id").val(this.elements._regModel.attributes.user_name);
                if ( this.elements._regModel.attributes.member_id == SessionModel.getUserInfo().id ) {
                    isMy = true;
                }
            }else{
                $(this.el).find("#submit_id").val(SessionModel.getUserInfo().name);
                isMy = true;
            }

            // 회의실 표기
            this.roomReserveView.getRoomInfo().done(function(result) {
                var roomCombo = $(_this.el).find('#room_code');
                for ( var i=0 ; i < result.length ; i++ ) {
                    var roomHtml = "<option value='" + result[i].index + "'>" + result[i].name + "</option>";
                    roomCombo.append(roomHtml);
                }
                ComboBox.createCombo(roomCombo);
                
                if ( _this.elements._regModel != null ) {
                    roomCombo.selectpicker("val", _this.elements._regModel.attributes.room_index);
                    if ( !isMy ) {
                        roomCombo.attr("readonly", true);
                        roomCombo.attr("disabled", true);
                    }
                }
            }).fail(function() {
                Dialog.error("회의실 데이터 조회를 실패했습니다.");
            });

            // 날짜 이벤트 추가
            this.setDatePickerPop(isMy);

            // 시간 이벤트 추가
            this.setTimePickerPop(isMy);

            //
            if ( this.elements._regModel != null ) {
                this.setDataToDOM(isMy);
                // 버튼 조절
            }

            dfd.resolve();
            return dfd.promise();
        },

        setDatePickerPop: function(isMy) {
            var _this = this;
            var startDate = $(this.el).find("#start_date");
            //beforeDate.attr('readonly', true);
            
            var date;
            if ( this.elements._regModel != null ) {
                date = this.elements._regModel.attributes.date;
            }else{
                date = Moment(new Date()).format("YYYY-MM-DD");
            }
            this.startDate = startDate.datetimepicker({
                todayBtn: "linked",
                pickTime: false,
                language: "ko",
                todayHighlight: true,
                format: "YYYY-MM-DD",
                autoclose: true,
                defaultDate: date
            });

            if ( !isMy ) {
                startDate.attr('readonly',true);
                startDate.attr('disabled',true);

                $(this.el).find('#start_date input').attr('readonly', true);
                $(this.el).find('#start_date input').attr('disabled', true);
            }
        },

        setTimePickerPop: function(isMy) {

            var sTime;
            var eTime;

            if ( this.elements._regModel != null ) {
                sTime = this.elements._regModel.attributes.start_time;
                eTime = this.elements._regModel.attributes.end_time;
            }

             var startTime = $(this.el).find("#start_time");
            //beforeDate.attr('readonly', true);
            this.startTime = startTime.datetimepicker({
                pickDate: false,
                language: "ko",
                format: "HH:mm",
                use24hours: true,
                autoclose: true,
                defaultDate: sTime
            });

            var endTime = $(this.el).find("#end_time");
            //afterDate.attr('readonly', true);
            this.endTime = endTime.datetimepicker({
                pickDate: false,
                language: "ko",
                format: "HH:mm",
                use24hours: true,
                autoclose: true,
                defaultDate: eTime
            });

            if ( !isMy ) {
                startTime.attr('readonly',true);
                startTime.attr('disabled',true);
                
                endTime.attr('readonly',true);
                endTime.attr('disabled',true);

                $(this.el).find('#start_time input').attr('readonly', true);
                $(this.el).find('#start_time input').attr('disabled', true);

                $(this.el).find('#end_time input').attr('readonly', true);
                $(this.el).find('#end_time input').attr('disabled', true);
            }
        },
        
        onClickBtnReg: function(){
            var dfd = new $.Deferred();
            var formData = this.getFormData($(this.el).find('form'));
            console.log(formData);
            
            var roomRegModel = new RoomRegModel();
            var attributes = roomRegModel.attributes;
            attributes.room_index = formData.room_code;
            attributes.member_id  = SessionModel.getUserInfo().id;
            attributes.title      = formData.title;
            attributes.date       = formData.start_date;
            attributes.start_time = formData.start_time;
            attributes.end_time   = formData.end_time;
            attributes.desc       = formData.submit_desc;
            
            // Insert / Update 체크
            if ( this.elements._regModel != null ) {
                attributes.index = this.elements._regModel.attributes.index;
            }

            // 유효성 체크
            if ( _.isUndefined(attributes.room_index) || attributes.room_index < 0 ) {
                Dialog.error("회의실 정보 입력 오류");
                return dfd.reject();
            }

            if ( _.isUndefined(attributes.title) || attributes.title <= 0 ) {
                Dialog.error("제목을 입력하세요.");
                return dfd.reject();
            }

            if ( _.isUndefined(attributes.date) || attributes.date.length <= 0 ) {
                Dialog.error("일자를 입력하세요.");
                return dfd.reject();
            }

            if ( Moment(attributes.date,"YYYY-MM-DD").isBefore(Moment(new Date()).format("YYYY-MM-DD"))) {
                Dialog.error("오늘 이전 날짜의 회의는 예약이 불가합니다.");
                return dfd.reject();
            }

            if ( _.isUndefined(attributes.start_time) || attributes.start_time.length <= 0 ) {
                Dialog.error("회의 시작시간을 입력하세요.");
                return dfd.reject();
            }

            if ( Moment(attributes.start_time,"HH:mm:ss").isBefore(Moment("08:00:00","HH:mm:ss") ) ) {
                Dialog.error("회의실 예약은 08시 이후부터 가능합니다.");
                return dfd.reject();
            }

            if ( _.isUndefined(attributes.end_time) || attributes.end_time.length <= 0 ) {
                Dialog.error("회의 종료시간을 입력하세요.");
                return dfd.reject();
            }

            if ( Moment(attributes.end_time,"HH:mm:ss").isAfter(Moment("19:00:00","HH:mm:ss") ) ) {
                Dialog.error("회의실 예약은 19시 이전까지 가능합니다.");
                return dfd.reject();
            }

            // 정상성 체크
            if ( attributes.start_time == attributes.end_time ) {
                Dialog.error("회의 시작/종료 시간이 동일합니다.");
                return dfd.reject();
            }

            // 회의 시작/종료 시간 뒤집힘 체크
            if ( attributes.start_time > attributes.end_time ) {
                Dialog.error("회의 시작/종료 시간이 잘못 설정됐습니다.");
                return dfd.reject();
            }
            
            // 2시간 초과 체크
            var endTimeMax = Moment(attributes.start_time,"HH:mm").add(2,"hours").format("HH:mm");
            if ( endTimeMax < attributes.end_time ) {
                Dialog.error("회의 시간은 2시간을 초과할 수 없습니다.");
                return dfd.reject();
            }
            
            roomRegModel.save({}, {
                success : function(result){
                    if ( _.isUndefined(result.attributes.ERR_CODE) ) {
                        Dialog.info("회의실 예약 완료");
                        dfd.resolve(result);
                    }else{
                        Dialog.error("회의실이 이미 예약되어 있습니다.");
                        dfd.reject();
                    }
                    
                }, error : function(err){
                    Dialog.error("회의실 예약 실패!!");
                    dfd.reject(err);
                }
            });
            return dfd.promise();
        },

        onClickBtnDel: function(){
            var dfd = new $.Deferred();
            var formData = this.getFormData($(this.el).find('form'));
            console.log(formData);
            
            var roomRegModel = new RoomRegModel();
            
            if ( this.elements._regModel != null ) {
                roomRegModel.attributes.index = this.elements._regModel.attributes.index;
            }else{
                Dialog.error("취소할 회의를 선택해주세요.");
                dfd.reject(err);
            }

            Dialog.confirm({
                msg : "회의실 예약을 취소하시겠습니까?",
                action:function(){
                    var dfd2 = new $.Deferred();
                    roomRegModel.destroy({
                        success : function(result){
                            Dialog.info("회의실 예약 취소 완료");
                            dfd2.resolve(result);
                            dfd.resolve(result);
                        },
                        error : function(err) {
                            Dialog.error("회의실 예약 취소 실패!!");
                            dfd2.reject(err);
                            dfd.reject(err);
                        }
                    });
                    return dfd2.promise();
                },
                actionCallBack:function(res){
                    
                }
            });
            return dfd.promise();
        },

        getFormData: function(form) {
            // input value
            var unindexed_array = form.serializeArray();
            var indexed_array = {};

            $.map(unindexed_array, function(n, i) {
                indexed_array[n['name']] = n['value'];
            });

            return indexed_array;
        },

        setData: function(roomRegModel) {
            this.elements._regModel = roomRegModel;
        },

        setDataToDOM: function(isMy) {
            if ( this.elements._regModel == null )
                return;

            // 제목
            $(this.el).find("#title").val(this.elements._regModel.attributes.title);

            // 메모
            $(this.el).find("#submit_desc").val(this.elements._regModel.attributes.description);

            if ( !isMy ) {
                $(this.el).find("#title").attr("disabled", true);
                $(this.el).find("#submit_desc").attr("disabled", true);
            }
        }

    });
    
    return EditRoomRegPopupView;
});