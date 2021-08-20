define([
  'jquery',
  'underscore',
  'backbone',
  'cmoment',
  'dialog',
  'comboBox',
  'models/sm/SessionModel',
  'collection/yescalendar/YesCalendarTypeCollection',
  'models/yescalendar/YesCalendarModel',
  'text!templates/yesCalendar/yesCalendarDialog.html',
  'views/yescalendar/popup/YesCalendarTypeDialog',
], function (
  $, _, Backbone, Moment, Dialog,
  ComboBox,
  SessionModel,
  YesCalendarTypeCollection,
  YesCalendarModel,
  yesCalendarDialogHtml,
  YesCalendarTypeDialog,
) {
    var YesCalendarDialog = Backbone.View.extend({
      elements: {
        selectedYesCalendarModel: undefined,
        defaultDate: {startDate: undefined, endDate: undefined},
        yesCalendarTypeCollection: {},
        ParentDialog: {}
      },
      
      initialize: function (ParentDialog) {
        this.elements.selectedYesCalendarModel = undefined;
        this.elements.defaultDate = {startDate: undefined, endDate: undefined}
        this.elements.ParentDialog = ParentDialog;
      },

      closeModal: function () {
        $(this.el).off();
      },

      setTargetDate: function(targetDate) {
        this.elements.defaultDate.startDate = targetDate;
        this.elements.defaultDate.endDate = targetDate;
      },

      setSelectedYesCalendarModel: function(selectedYesCalendarModel) {
        this.elements.selectedYesCalendarModel = selectedYesCalendarModel;
      },

      render: function (el) {
        var dfd = new $.Deferred();
        var _this = this;
        this.el = el;

        $(this.el).append(yesCalendarDialogHtml);
        var isMy = false;

        if (this.elements.selectedYesCalendarModel) {
          $(this.el).find("#title").val(this.elements.selectedYesCalendarModel.title);
          $(this.el).find("#calendar_memo").val(this.elements.selectedYesCalendarModel.memo);

          if (SessionModel.getUserInfo().id === this.elements.selectedYesCalendarModel.member_id) {
            isMy = true;
          }
        } else {
          isMy = true;
          $(this.el).find("#title").val("");
          $(this.el).find("#calendar_memo").val("");
        }

        // 날짜 이벤트 추가
        this.setDatePickerPop(isMy);

        if (isMy === true) {
          // 편집 이벤트 추가
          $(this.el).on('click', '#add-calendar-type', _.bind(this.onClickAddClanedarType, this));
          $(this.el).on('click', '#update-calendar-type', _.bind(this.onClickUpdateClanedarType, this));
        } else {
          $(this.el).find("#title").attr("disabled", true);
          $(this.el).find("#calendar_memo").attr("disabled", true);
          $(this.el).find("#add-calendar-type").css("display", "none");
          $(this.el).find("#update-calendar-type").css("display", "none");
          $(this.el).find("#yescalendar_type").attr("disabled", true);

          $(this.el).find("#start_date").attr("readonly", true);
          $(this.el).find("#start_date").attr("disabled", true);
          $(this.el).find("#end_date").attr("disabled", true);
        }

        // 캘린더 표기
        if (isMy) {
          this.elements.yesCalendarTypeCollection = new YesCalendarTypeCollection();
          this.elements.yesCalendarTypeCollection.fetch({
            success: function (yesCalendarTypeCol) {
              var yesCalendarTypeEl = $(_this.el).find('#yescalendar_type');
              for (var i = 0; i < yesCalendarTypeCol.length; i++) {
                var model = yesCalendarTypeCol.models[i];
                if (model.get('visible') === "1") {
                  var html = "<option value='" + model.get('calendar_type_id') + "'>" + model.get('calendar_type_str') + "</option>";
                  yesCalendarTypeEl.append(html);
                }
              }
              ComboBox.createCombo(yesCalendarTypeEl);
  
              if (_this.elements.selectedYesCalendarModel) {
                yesCalendarTypeEl.selectpicker("val", _this.elements.selectedYesCalendarModel.calendar_type);
              }
  
              dfd.resolve(_this);
            },
            error: function() {
              Dialog.error("캘린더 데이터 조회를 실패했습니다.");
            }
          });
        } else {
          var yesCalendarTypeEl = $(this.el).find('#yescalendar_type');
          var html = "<option value='" + this.elements.selectedYesCalendarModel.calendar_type + "'>" + this.elements.selectedYesCalendarModel.calendar_type_str + "</option>";
          yesCalendarTypeEl.append(html);
          ComboBox.createCombo(yesCalendarTypeEl);
          dfd.resolve(this);
        }

        return dfd.promise();
      },

      afterRender: function() {
        
      },

      setDatePickerPop: function (isMy) {
        var _this = this;
        var startDate = $(this.el).find("#start_date");

        var startDateVal;
        if (this.elements.selectedYesCalendarModel !== undefined) {
          startDateVal = this.elements.selectedYesCalendarModel.start;
        } else if (this.elements.defaultDate.startDate !== undefined) {
          startDateVal = this.elements.defaultDate.startDate;
        } else {
          startDateVal = Moment(new Date()).format("YYYY-MM-DD");
        }
        this.startDate = startDate.datetimepicker({
          todayBtn: "linked",
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          autoclose: true,
          defaultDate: startDateVal,
        });
        if (isMy) {
          this.startDate.change(function() {
            var startDateVal = $('#start_date input').val();
            var endDateVal = $('#end_date input').val();
            if (startDateVal >= endDateVal) {
              $(_this.endDate[0]).data('DateTimePicker').setDate(startDateVal);
            }
            $(_this.endDate[0]).data('DateTimePicker').setMinDate($('#start_date input').val());
          });
        } else {
          $(this.el).find('#start_date input').attr('readonly', true);
          $(this.el).find('#start_date input').attr('disabled', true);
        }

        var endDate = $(this.el).find("#end_date");
        var endDateVal;

        if (this.elements.selectedYesCalendarModel !== undefined) {
          endDateVal = this.elements.selectedYesCalendarModel.end;
        } else if (this.elements.defaultDate.endDate !== undefined) {
          endDateVal = this.elements.defaultDate.endDate;
        } else {
          endDateVal = Moment(new Date()).format("YYYY-MM-DD");
        }
        this.endDate = endDate.datetimepicker({
          todayBtn: "linked",
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          autoclose: true,
          defaultDate: endDateVal,
        });

        // 최초 range 설정
        $(this.endDate[0]).data('DateTimePicker').setMinDate(startDateVal);

        if (!isMy) {
          $(this.el).find('#end_date input').attr('readonly', true);
          $(this.el).find('#end_date input').attr('disabled', true);
        }
      },

      submitAdd: function() {
        var dfd = new $.Deferred();
        var formData = this.getFormData();
        if (this.checkFormData(formData) === false) {
          dfd.reject();
          return dfd;
        }

        var yesCalendarModel = new YesCalendarModel(formData);
        yesCalendarModel.save().done(function() {
          dfd.resolve();
        }).fail(function(error){
          Dialog.error("일정 추가 실패 : " + error.responseJSON.message);
          dfd.reject();
        });

        return dfd;
      },

      submitEdit: function() {
        var dfd = new $.Deferred();
        var formData = this.getFormData();
        if (this.checkFormData(formData) === false) {
          dfd.reject();
          return dfd;
        }

        var yesCalendarModel = new YesCalendarModel(formData);
        yesCalendarModel.set("calendar_id", this.elements.selectedYesCalendarModel.calendar_id);
        yesCalendarModel.save().done(function() {
          dfd.resolve();
        }).fail(function(error){
          Dialog.error("일정 수정 실패 : " + error.responseJSON.message);
          dfd.reject();
        });

        dfd.resolve();
        return dfd;
      },

      submitRemove: function() {
        var dfd = new $.Deferred();

        var yesCalendarModel = new YesCalendarModel();
        yesCalendarModel.set("calendar_id", this.elements.selectedYesCalendarModel.calendar_id);
        yesCalendarModel.destroy().done(function() {
          dfd.resolve();
        }).fail(function(error){
          dfd.reject(error);
        });

        return dfd;
      },

      checkFormData: function(formData) {
        // 유효성 체크
        if (formData.title.length === 0) {
          Dialog.error("제목을 입력하세요.");
          return false;
        }

        if (_.isUndefined(formData.yescalendar_type)) {
          Dialog.error("캘린더를 선택하세요.");
          return false;
        }

        if (formData.startDate > formData.endDate) {
          Dialog.error("기간을 확인하세요.");
          return false;
        }

        return true;
      },

      getFormData: function () {
        // input value
        var form = $(this.el).find('form');
        var unindexed_array = form.serializeArray();
        var formData = {};

        $.map(unindexed_array, function (n, i) {
          formData[n['name']] = n['value'];
        });
        return formData;
      },

      onClickAddClanedarType: function() {
        var _this = this;
        var yesCalendarTypeEl = $(this.el).find('#yescalendar_type');
        var yesCalendarTypeDialog = new YesCalendarTypeDialog();

        Dialog.show({
          title: "캘린더 등록",
          content: yesCalendarTypeDialog,
          buttons: [{
            label: "등록",
            cssClass: Dialog.CssClass.SUCCESS,
            action: function (dialogRef) { // 버튼 클릭 이벤트
              yesCalendarTypeDialog.submitAdd().done(function (model, response) {
                // 캘린더 콤보박스 다시 그리고 추가된 모델을 선택되도록 한다.
                _this.el.find("#yescalendar_type option").remove();

                // Insert 할때와 select 할때의 구조가 달라서 아래와 같이 처리 함.
                var addModel = _.find(response.list_all, function(item) {
                  if (model.get("calendar_type_id") === item.calendar_type_id) {
                    return item;
                  }
                });
                _this.elements.yesCalendarTypeCollection.add(addModel);

                for (var item of response.list_all) {
                  if (item.visible === 1) {
                    var html = "<option value='" + item.calendar_type_id + "'>" + item.calendar_type_str + "</option>";
                    yesCalendarTypeEl.append(html);
                  }
                }
                yesCalendarTypeEl.selectpicker('refresh');
                yesCalendarTypeEl.selectpicker('val', model.get("calendar_type_id"));

                yesCalendarTypeDialog.closeModal();
                dialogRef.close();
                _this.elements.ParentDialog.refreshYesCalendarData();
              });
            }
          }, {
            label: '취소',
            action: function (dialogRef) {
              yesCalendarTypeEl.selectpicker('val', $("#yescalendar_type option:eq(0)")[0].value); // 첫번째 값 선택하도록 함.
              yesCalendarTypeDialog.closeModal();
              dialogRef.close();
            }
          }]
        });
        
      },

      onClickUpdateClanedarType: function() {
        var _this = this;
        var yesCalendarTypeEl = $(this.el).find('#yescalendar_type');
        var yesCalendarTypeDialog = new YesCalendarTypeDialog();
        var selectedYesCalendarTypeModel = this.elements.yesCalendarTypeCollection.get(this.el.find("#yescalendar_type").val())
        if (selectedYesCalendarTypeModel.get("calendar_type_id") === 1) {
          Dialog.info("기본 캘린더는 편집할 수 없습니다.");
          return;
        }
        yesCalendarTypeDialog.setSelectedYesCalendarTypeModel(selectedYesCalendarTypeModel);

        Dialog.show({
          title: "캘린더 수정/삭제",
          content: yesCalendarTypeDialog,
          buttons: [{
            label: "삭제",
            cssClass: Dialog.CssClass.WARNING + " float-left",
            action: function (dialogRef) { // 버튼 클릭 이벤트
              Dialog.confirm({
                msg : "캘린더를 삭제하시겠습니까?\n캘린더에 소속된 일정들은 기본 일정 캘린더로 변경됩니다.",
                action: function () {
                  var dfd = new $.Deferred();
                  yesCalendarTypeDialog.submitRemove().done(function (result) {
                    yesCalendarTypeDialog.closeModal();
                    dialogRef.close();

                    _this.elements.ParentDialog.refreshYesCalendarData();

                    _this.el.find("#yescalendar_type option[value=" + selectedYesCalendarTypeModel.get("calendar_type_id") + "]").remove();
                    yesCalendarTypeEl.selectpicker('refresh');

                    dfd.resolve();
                  }).fail(function(error) {
                    if (error.responseJSON) {
                      dfd.reject({msg: "캘린더 삭제 실패 : " + error.responseJSON.message});
                    } else {
                      dfd.reject({msg: "캘린더 삭제 실패"});
                    }
                  });
                  return dfd;
                },
              });
            }
          }, {
            label: '수정',
            cssClass: Dialog.CssClass.SUCCESS,
            action: function (dialogRef) {
              var dfd = new $.Deferred();
              yesCalendarTypeDialog.submitEdit().done(function (model) {
                yesCalendarTypeDialog.closeModal();
                dialogRef.close();

                _this.el.find("#yescalendar_type option[value=" + selectedYesCalendarTypeModel.get("calendar_type_id") + "]").text(model.get("calendar_type_str"));
                yesCalendarTypeEl.selectpicker('refresh');
              
                // yesCalendarTypeEl.selectpicker('val', $("#yescalendar_type option:eq(0)")[0].value); // 첫번째 값 선택하도록 함.
                yesCalendarTypeDialog.closeModal();
                dialogRef.close();

                _this.elements.yesCalendarTypeCollection.remove(model);
                _this.elements.yesCalendarTypeCollection.add(model);
                _this.elements.ParentDialog.refreshYesCalendarData();

                dfd.resolve();
              });
              return dfd;
            }
          }, {
            label: '취소',
            action: function (dialogRef) {
              yesCalendarTypeDialog.closeModal();
              dialogRef.close();
            }
          }]
        });
      },

    });

    return YesCalendarDialog;
  });