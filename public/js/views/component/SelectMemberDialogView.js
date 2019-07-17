define([
  'jquery',
  'underscore',
  'underscore.string',
  'core/BaseView',
  'log',
  'dialog',
  'i18n!nls/common',
  'collection/sm/UserCollection',
  'collection/sm/DepartmentCollection',
  'text!templates/component/selectMemberPopup.html',
  'text!templates/default/checkBoxDept.html',
  'text!templates/default/checkBoxMember.html',
], function ($, _, _S, BaseView, log, Dialog, i18nCommon, UserCollection, DepartmentCollection, selectMemberPopupTmp, checkBoxDeptTempl, checkBoxMemberTempl) {
  var LOG = log.getLogger("RoomDialogView");

  var SelectMemberDialogView = BaseView.extend({
    elements: {
      userList: [],
      deptInfoList: [], // {dept: xxxx, totalCount: xx, selectedCount: xx}
      attendanceList: [] // {id: 사번, name: 이름, dept: 부서코드} 배열
    },
    events: {
      // 'click #checkAllDept': 'onClickCheckDeptAll',
      // 'click .member-class': 'onClickMember'
    },
    initialize: function () {  
    },
    setBeforeRender: function(selectedAttendanceList) {
      if (selectedAttendanceList) {
        this.elements.attendanceList = _.clone(selectedAttendanceList);
      } else {
        this.elements.attendanceList = [];
      }
    },
    destroy: function () {
      $(this.el).off();
    },
    render: function (el) {
      var dfd = new $.Deferred();
      var _this = this;
      this.el = el;

      $(this.el).append(selectMemberPopupTmp);

      $(_this.el).on("click", "#checkAllDept", _.bind(_this.onClickCheckDeptAll, _this));
      $(_this.el).on("click", "#checkAllMember", _.bind(_this.onClickCheckMemberAll, _this));
      $(_this.el).on("click", ".room-reg-attendance-text", _.bind(_this.onClickRemoveOne, _this));
      $(_this.el).on("click", "#clear_btn", _.bind(_this.onClickClearBtn, _this));

      var promiseArr = [];
			var userCollection = new UserCollection();
			promiseArr.push(userCollection.fetch());
			var departmentCollection = new DepartmentCollection();
      promiseArr.push(departmentCollection.fetch());
      
      this.elements.checkBoxDeptTemplate = _.template(checkBoxDeptTempl);
      this.elements.checkBoxMemberTemplate = _.template(checkBoxMemberTempl);

      $.when.apply($, promiseArr).then(function(userParam, deptParam){
        _this.elements.userList = userParam[0];
        var deptList = deptParam[0];

        // 부서별 총원을 구함.
        var deptMemberCount = _.countBy(_this.elements.userList, function(user) {
          if (user.leave_company !== "" && user.leave_company !== null) {
            return undefined;
          }
          return user.dept_code;
        });
        // console.log(deptMemberCount);

        var $deptListDiv = $(_this.el).find("#dept_list");
        for (var dept of deptList) {
          if (dept.use == 0 || deptMemberCount[dept.code] === undefined) {
            continue;
          }
          
          _this.elements.deptInfoList[dept.code] = ({code: dept.code, totalCount: deptMemberCount[dept.code], selectedCount: 0});
          var param = {
            type: "dept",
            id: dept.code,
            name: dept.name,
            totalCount: _this.elements.deptInfoList[dept.code].totalCount,
            class: "dept-class"
          };
          var cb2 = _this.elements.checkBoxDeptTemplate(param);
          $deptListDiv.append(cb2);
          $(_this.el).find("#" + dept.code).off().on("click", _.bind(_this.onClickDeptCheckBox, _this));
        }
        
        _this.drawAttendanceList();
        dfd.resolve(_this);
      });
      
      return dfd.promise();
    },

    afterRender: function() {
      this.setAttendanceDeptCount();
    },

    // 선택 가능한 사원 체크박스 출력 ( 기 선택된 사람은 체크된 상태로 출력 됨. )
    setMemberList: function() {
      var _this = this;

      var $checkBoxList = $(".dept-class");
      var checkedDeptList = [];
      for (var idx = 0 ; idx < $checkBoxList.length ; idx++) {
        var cb = $checkBoxList[idx];
        if ($("input:checkbox[id='"+ cb.id +"']").is(":checked") === true) {
          checkedDeptList.push(cb.id);
        }
      }
      // console.log(cb.id);
      $("#dept_member_list .custom-control").remove();
      var $memberCheckBoxList = $(_this.el).find("#dept_member_list");
      for (var user of _this.elements.userList) {
        if (user.leave_company !== "" && user.leave_company !== null) {
          continue;
        }
        // console.log(user);
        if (_.indexOf(checkedDeptList, user.dept_code) >= 0) {
          var param = {
            type: "member",
            id: user.id,
            name: user.name,
            dept_code: user.dept_code,
            class: "member-class"
          };

          var cb2 = _this.elements.checkBoxMemberTemplate(param);
          $memberCheckBoxList.append(cb2);

          // 현재 포함되어 있는지 확인
          var index = this.elements.attendanceList.findIndex(function(item) {return item.id === user.id})
          if (index >= 0) {
            // console.log(cb2);
            $("input:checkbox[id='"+ user.id + "']").prop("checked", true);
          }
        }
      }

      $(_this.el).find(".member-class").off().on("click", _.bind(_this.onClickCheckboxMember, this));

      this.setCheckAllMemberCheckBox();

      // $("input:checkbox[id='ID']").is(":checked") == true : false  /* by ID */
      // $("input:checkbox[name='NAME']").is(":checked") == true : false /* by NAME */

      // $("input:checkbox[id='ID']").prop("checked", true); /* by ID */
      // $("input:checkbox[name='NAME']").prop("checked", false); /* by NAME */

      // 전체선택 체크박스를 선택하면 그 아래의 모든 체크박스를 선택 jQuery
      // $(function(){
      //     $("#check_all").click(function(){
      //         var chk = $(this).is(":checked");//.attr('checked');
      //         if(chk) $(".select_subject input").prop('checked', true);
      //         else  $(".select_subject input").prop('checked', false);
      //     });
      // });

    },

    onClickDeptCheckBox: function(event) {
      // console.log("onClickDeptCheckBox : " + event.target.parentElement.id);

      var $checkBoxList = $(".dept-class");
      // 전체가 체크되어 있을 경우 전체를 체크한다. 전체가 체크되지 않은 경우 전체 체크박스를 해제
      var checkCount = 0;
      for (var idx = 0 ; idx < $checkBoxList.length ; idx++) {
        var cb = $checkBoxList[idx];
        if ($("input:checkbox[id='"+ cb.id +"']").is(":checked") === true) {
          checkCount++;
        }
      }
      var $checkAllDept = $("#checkAllDept");
      if (checkCount === $checkBoxList.length) {
        $checkAllDept.prop('checked', true);
      } else {
        $checkAllDept.prop('checked', false);
      }

      this.setMemberList();
    },

    // 부서 전체 체크 박스 클릭
    onClickCheckDeptAll: function(event) {
      var $checkBoxList = $(".dept-class");
      var setValue = false
      if ($("input:checkbox[id='checkAllDept']").is(":checked") === true) {
        setValue = true
      }
      
      for (var idx = 0 ; idx < $checkBoxList.length ; idx++) {
        var cb = $checkBoxList[idx];
        $(cb).prop('checked', setValue);
      }
      this.setMemberList();
      // console.log("onClickCheckDeptAll   ==== DEPT ALL");
    },

    // 사원 전체 체크 박스 클릭
    onClickCheckMemberAll: function(event) {
      var $checkBoxList = $(".member-class");
      var setValue = false
      if ($("input:checkbox[id='checkAllMember']").is(":checked") === true) {
        setValue = true
      }
      
      var memberList = [];
      for (var idx = 0 ; idx < $checkBoxList.length ; idx++) {
        var cb = $checkBoxList[idx];
        var $cb = $(cb);
        $cb.prop('checked', setValue);
        memberList.push({id: $cb.attr('id'), name: $cb.attr('name'), dept_code: $cb.attr('dept_code')})
      }

      this.setAttendance(setValue, memberList);
    },

    onClickCheckboxMember: function(event) {
      // console.log(event.target);
      var $target = $(event.target);
      var m = [{"id": $target.attr("id"), "name": $target.attr("name"), "dept_code": $target.attr("dept_code")}];
      var isPush = false;

      if ($("input:checkbox[id='" + $target.attr("id") +"']").is(":checked") === true) {
        isPush = true;
      }

      if (isPush) {
        this.setCheckAllMemberCheckBox();
      } else {
        // 전체 선택 unckeck
        $("input:checkbox[id='checkAllMember']").prop("checked", false);
      }

      this.setAttendance(isPush, m);
    },

    // 참석자 대상 추가 / 삭제
    setAttendance: function(isPush, memberList) {
      if (isPush === true) {
        // 추가
        for (var member of memberList) {
          var index = this.elements.attendanceList.findIndex(function(item) {return item.id === member.id})
          if (index === -1) {
            this.elements.attendanceList.push(member);
          }
        }
      } else {
        // 삭제
        for (var member of memberList) {
          var index = this.elements.attendanceList.findIndex(function(item) {return item.id === member.id})
          if (index >= 0) {
            this.elements.attendanceList.splice(index, 1);
          }
        }
      }
      this.drawAttendanceList();
      this.setAttendanceDeptCount();
      // console.log(this.elements.attendanceList);
    },

    // 현재 선택된 멤버를 참석자 란에 출력 함.
    drawAttendanceList: function() {
      var $member_list = this.el.find("#selected_member_list");
      $member_list.empty();
      for (var member of this.elements.attendanceList) {
        $member_list.append("<p member-id='" + member.id + "' class='room-reg-attendance-text'>" + member.name + "</p>");
      }
      var $attendanceCount = this.el.find("#selected_attendance_count");
      $attendanceCount.text(this.elements.attendanceList.length + "명");
    },

    // 참석자 칸에서 멤버 클릭시 멤버 삭제 기능 수행
    onClickRemoveOne: function(event) {
      // console.log(event.target);
      var id = $(event.target).attr('member-id');
      this.setAttendance(false, [{id: id}]);
      $("input:checkbox[id='"+ id +"']").prop("checked", false);
      this.setCheckAllMemberCheckBox();
    },

    // 전체 멤버 전체 선택 체크 여부 확인 및 설정
    setCheckAllMemberCheckBox: function() {
      var $checkBoxList = $(".member-class");
      var checkCount = 0;
      for (var idx = 0 ; idx < $checkBoxList.length ; idx++) {
        var cb = $checkBoxList[idx];
        var $cb = $(cb);
        if ($cb.is(':checked') === false) {
          break;
        }
        checkCount++;
      }
      if ($checkBoxList.length !== 0 && checkCount === $checkBoxList.length) {
        $("input:checkbox[id='checkAllMember']").prop("checked", true);
      } else {
        $("input:checkbox[id='checkAllMember']").prop("checked", false);
      }
    },

    // 부서 정보 체크박스에서 참여 인원 업데이트
    setAttendanceDeptCount: function() {
      var _this = this;

      var deptGroup = _.groupBy(this.elements.attendanceList, function(atUser) {
        return atUser.dept_code;
      });

      var $checkBoxList = $(".dept-class");
      for (var idx = 0 ; idx < $checkBoxList.length ; idx++) {
        var deptCode = $($checkBoxList[idx]).attr('id');
        // var deptName = $($checkBoxList[idx]).attr('name');
        var selectedCount = deptGroup[deptCode];
        if (selectedCount === undefined) {
          selectedCount = 0;
        } else {
          selectedCount = deptGroup[deptCode].length;
        }
        var str = " ("+ selectedCount + "/" + _this.elements.deptInfoList[deptCode].totalCount +")"
        // $($checkBoxList[idx].parentElement).find('label').text(deptName + str);
        $($($checkBoxList[idx].parentElement).find('label')[1]).text(str);
      }
    },

    // 초기화 버튼 클릭
    onClickClearBtn: function() {
      this.elements.attendanceList = [];
      this.setMemberList();
      this.drawAttendanceList();
      this.setAttendanceDeptCount();
    }
  });

  return SelectMemberDialogView;
});