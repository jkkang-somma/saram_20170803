define([
  'jquery',
  'underscore',
  'backbone',
  'tool/d3_460/d3.min',
  'i18n!nls/common',
  'dialog',
  'comboBox',
  'code',
  'models/yescalendar/YesCalendarTypeModel',
  'views/component/SelectMemberDialogView',
  'text!templates/yesCalendar/yesCalendarTypeDialog.html',
], function (
  $, _, Backbone, d3, i18Common, Dialog,
  ComboBox,
  Code,
  YesCalendarTypeModel,
  SelectMemberDialogView,
  yesCalendarTypeDialogHtml,
) {
    var YesCalendarTypeDialog = Backbone.View.extend({
      elements: {
        selectedYesCalendarTypeModel: undefined,
        attendanceList: [] // {id: 사번, name: 이름, dept: 부서코드} 배열
      },
      
      initialize: function () {
        this.elements.selectedYesCalendarTypeModel = undefined;
        this.elements.attendanceList = [];
      },

      closeModal: function () {
        $(this.el).off();
      },

      setSelectedYesCalendarTypeModel: function(selectedYesCalendarTypeModel) {
        this.elements.attendanceList = [];
        this.elements.selectedYesCalendarTypeModel = selectedYesCalendarTypeModel;
        var share_member_id = selectedYesCalendarTypeModel.get("share_member_list");
        if (share_member_id) {
          if (typeof share_member_id === "string") {
            var shareMemberIdList = selectedYesCalendarTypeModel.get("share_member_list").split(",");
            var userCodes = Code.getCodes(Code.USER);
            for (var shareMemberId of shareMemberIdList) {
              var memberInfo = _.find(userCodes, {"code": shareMemberId})
              if (memberInfo) {
                this.elements.attendanceList.push({id: shareMemberId, name: memberInfo.name, dept_code: memberInfo.dept_code});
              }
            }
          } else {
            if (typeof share_member_id === "object") {
              this.elements.attendanceList = share_member_id;
            }
          }
        }
      },

      render: function (el) {
        var dfd = new $.Deferred();
        var _this = this;
        this.el = el;

        $(this.el).append(yesCalendarTypeDialogHtml);

        var selectBackgroundColorPanel = $(this.el).find("#select-background-color-panel");
        var colorList = d3.schemeCategory20;
        for (var color of colorList) {
          selectBackgroundColorPanel.append(
            $('<div class="select-color-box">').css("background", color).css("color", color).text(color)
          );
        }

        // Event
        $(this.el).on('click', '#select-background-color-panel .select-color-box', this.onClickBackgroundColor);
        $(this.el).on('click', '#select-font-color-panel .select-color-box', this.onClickTextColor);

        // 수동 입력 기능 - 일반 사용자에게 너무 어려운 기능일듯 하여 구현 보류... KJK
        // $(this.el).find("#calendar-type-background-color").on("change keyup paste", function() {
        //   var currentVal = $(this).val();
        //   if (_this.checkColor(currentVal)) {
        //     _this.onClickBackgroundColor(undefined, currentVal);
        //   }
        // });

        var shareComboEl = $(_this.el).find('#share-dept');
        shareComboEl.append("<option value='0'> 공유 안 함</option>");
        shareComboEl.append("<option value='1'> 공유 함</option>");
        ComboBox.createCombo(shareComboEl);

        if (this.elements.selectedYesCalendarTypeModel) {
          $(this.el).find("#calendar-type-name").val(this.elements.selectedYesCalendarTypeModel.get("calendar_type_str"));
          $(this.el).find("#share-dept").val(this.elements.selectedYesCalendarTypeModel.get("share_dept"));
          $(this.el).find("#share-dept").selectpicker('refresh');
          
          this.onClickBackgroundColor(undefined, this.elements.selectedYesCalendarTypeModel.get("color"), this.el);
          this.onClickTextColor(undefined, this.elements.selectedYesCalendarTypeModel.get("fcolor"), this.el);
        } else {
          // default value
          this.onClickBackgroundColor(undefined, "#1f77b4", this.el);
          this.onClickTextColor(undefined, "#ffffff", this.el);
        }

        $(this.el).on('click', '#select_member_list', _.bind(this.onClickSelectMemberList, this));
        
        this.drawAttendanceList();
        
        dfd.resolve(this);
        return dfd.promise();
      },

      afterRender: function() {
      },

      submitAdd: function() {
        var dfd = new $.Deferred();
        var formData = this.checkFormData(this.getFormData());
        if (formData === false) {
          dfd.reject();
          return dfd;
        }

        var yesCalendarTypeModel = new YesCalendarTypeModel(formData);
        yesCalendarTypeModel.save().done(function(result) {
          dfd.resolve(yesCalendarTypeModel, result);
        }).fail(function(error){
          if (error.responseJSON) {
            if (error.responseJSON.error.code === "ER_DUP_ENTRY") {
              Dialog.error("캘린더 수정 실패 : 이미 등록된 캘린더 이름이 있습니다.");
            } else {
              Dialog.error("캘린더 수정 실패 : " + error.responseJSON.message);
            }
          } else {
            Dialog.error("캘린더 수정 실패");
          }
          dfd.reject();
        });

        return dfd;
      },

      submitEdit: function() {
        var dfd = new $.Deferred();
        var formData = this.checkFormData(this.getFormData());
        if (formData === false) {
          dfd.reject();
          return dfd;
        }

        var yesCalendarTypeModel = new YesCalendarTypeModel(formData);
        yesCalendarTypeModel.set("calendar_type_id", this.elements.selectedYesCalendarTypeModel.get("calendar_type_id"));
        yesCalendarTypeModel.save().done(function(result) {
          dfd.resolve(yesCalendarTypeModel);
        }).fail(function(error){
          if (error.responseJSON) {
            if (error.responseJSON.error.code === "ER_DUP_ENTRY") {
              Dialog.error("캘린더 수정 실패 : 이미 등록된 캘린더 이름이 있습니다.");
            } else {
              Dialog.error("캘린더 수정 실패 : " + error.responseJSON.message);
            }
          } else {
            Dialog.error("캘린더 수정 실패");
          }
          dfd.reject();
        });

        return dfd;
      },

      submitRemove: function() {
        var dfd = new $.Deferred();

        this.elements.selectedYesCalendarTypeModel.destroy().done(function() {
          dfd.resolve();
        }).fail(function(error){
          dfd.reject(error);
        });

        return dfd;
      },

      checkFormData: function(formData) {
        var resultFormData = {};

        resultFormData.calendar_type_str = formData["calendar-type-name"];
        resultFormData.color = formData["calendar-type-background-color"];
        resultFormData.fcolor = formData["calendar-type-font-color"];
        resultFormData.share_dept = formData["share-dept"];
        resultFormData.share_member_list = this.elements.attendanceList;

        // 유효성 체크
        if (resultFormData.calendar_type_str.length === 0) {
          Dialog.error("이름을 입력하세요.");
          return false;
        }

        if (resultFormData.color.length === 0) {
          Dialog.error("배경 색상을 선택하세요.");
          return false;
        }

        if (resultFormData.fcolor.length === 0) {
          Dialog.error("글씨 색상을 선택하세요.");
          return false;
        }

        return resultFormData;
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

      onClickBackgroundColor: function(event, customValue, el) {
        var value;
        if (customValue) {
          value = customValue;
        } else {
          value = event.target.innerHTML;
        }
        if (el) {
          $(el).find("#calendar-type-background-color").val(value);
          $(el).find("#select-sample-color-box").css("background", value);
        } else {
          $("#calendar-type-background-color").val(value);
          $("#select-sample-color-box").css("background", value);
        }
      },

      onClickTextColor: function(event, customValue, el) {
        var value;
        if (customValue) {
          value = customValue;
        } else {
          value = $(event.target).data('color');
        }
        if (el) {
          $(el).find("#calendar-type-font-color").val(value);
          $(el).find("#select-sample-color-box").css("color", value);
        } else {
          $("#calendar-type-font-color").val(value);
          $("#select-sample-color-box").css("color", value);
        }
      },

      checkColor: function(value) {
        var rgbRegx = /^#[0-9a-f]{3,6}$/i;
        return rgbRegx.test(value);
      },

      // 공유 멤버 편집 버튼 클릭
      onClickSelectMemberList: function() {
        var _this = this;

        var selectMemberDialogView = new SelectMemberDialogView();
        selectMemberDialogView.setBeforeRender(_this.elements.attendanceList);
        Dialog.show({
          title: "사원 선택",
          content: selectMemberDialogView,
          buttons: [{
            label: i18Common.DIALOG.BUTTON.OK,
            cssClass: Dialog.CssClass.SUCCESS,
            action: function (dialogRef) {// 버튼 클릭 이벤트
              _this.elements.attendanceList = selectMemberDialogView.elements.attendanceList;
              _this.drawAttendanceList();
              selectMemberDialogView.destroy();
              dialogRef.close();
            }
          }, {
            label: i18Common.DIALOG.BUTTON.CANCEL,
            action: function (dialogRef) {
              selectMemberDialogView.destroy();
              dialogRef.close();
            }
          }]
        });
      },

      // 공유 멤버 정보 출력
      drawAttendanceList: function() {
        var $member_list = this.el.find("#member_list");
        $member_list.empty();

        if (this.elements.attendanceList !== undefined && this.elements.attendanceList !== null) {
          var $attendanceCount = this.el.find("#share_member_count");
          var comma = ",";
          for (var idx = 0 ; idx < this.elements.attendanceList.length ; idx++ ) {
            if (idx+1 === this.elements.attendanceList.length) {
              comma = "";
            }
            var member = this.elements.attendanceList[idx];
            $($member_list[0]).append("<p class='room-reg-attendance-text no-action'>" + member.name + comma + " </p>");
          }
          $attendanceCount.text(this.elements.attendanceList.length + "명");
        }
      },
      
    });

    return YesCalendarTypeDialog;
  });