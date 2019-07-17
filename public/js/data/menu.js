// 각 View 마다 동일한 변수나 function 이 있을경우 이곳에 추가하여 사용
// 각 View는 BaseView 를 상속 하여 생성한다.
define([
  'jquery',
  'underscore',
  'schemas',
  'i18n!nls/common'
], function ($, _, SCHEMAS, i18Common) {
  var _menu = [{
    title: i18Common.MENU.TOP.BM, //기초자료
    subMenu: [{
      title: i18Common.MENU.SUB.BM.POSITION, //직급관리
      hashTag: "#positionmanager",
      auth: SCHEMAS.ADMIN,
      actionAuth: {
        add: SCHEMAS.ADMIN,
        remove: SCHEMAS.ADMIN,
        edit: SCHEMAS.ADMIN
      }
    }, {
      title: i18Common.MENU.SUB.BM.DEPARTMENT, //부서관리
      hashTag: "#departmentmanager",
      auth: SCHEMAS.ADMIN,
      actionAuth: {
        add: SCHEMAS.ADMIN,
        remove: SCHEMAS.ADMIN,
        edit: SCHEMAS.ADMIN
      }
    }, {
      title: i18Common.MENU.SUB.BM.PART, //파트관리
      hashTag: "#partmanager",
      auth: SCHEMAS.ADMIN,
      actionAuth: {
        add: SCHEMAS.ADMIN,
        remove: SCHEMAS.ADMIN,
        edit: SCHEMAS.ADMIN
      }
    }, {
      title: i18Common.MENU.SUB.BM.HOLIDAY, //휴일 관리
      hashTag: "#holidaymanager",
      auth: SCHEMAS.ADMIN
    }, {
      title: i18Common.MENU.SUB.BM.DOCUMENT, //양식관리
      hashTag: "#documentlist",
      auth: SCHEMAS.ADMIN
    }, {
      title: i18Common.MENU.SUB.BM.BOOKDOCUMENT, //도서관리
      hashTag: "#bookdocument",
      auth: SCHEMAS.ADMIN
    }]
  }, {
    title: i18Common.MENU.TOP.SM, //사원 관리
    subMenu: [{
      title: i18Common.MENU.SUB.SM.USER, //사용자 관리
      hashTag: "#usermanager",
      auth: SCHEMAS.USER,
      actionAuth: {
        add: SCHEMAS.ADMIN,
        remove: SCHEMAS.ADMIN,
        edit: SCHEMAS.ADMIN
      }
    }, {
      title: "자리배치도",
      hashTag: "#gis",
      auth: SCHEMAS.USER
    }, {
      title: "자리배치도-이력",
      hashTag: "#gisHistory",
      auth: SCHEMAS.ADMIN
    }, {
      title: i18Common.MENU.SUB.BM.ORGANIZATION, //조직도
      hashTag: "#organization",
      auth: SCHEMAS.DEPT_BOSS
    }, {
      title: "사진 등록", //사진 등록
      hashTag: "#userpic",
      auth: SCHEMAS.ADMIN
    }, {
      title: i18Common.MENU.SUB.SM.VACATION, //연차 관리
      hashTag: "#vacation",
      auth: SCHEMAS.USER
    }]
    // ,{
    //     title:i18Common.MENU.SUB.SM.REPORTCOMMUTE, //근태 레포트 
    //     hashTag:"#reportCommute",
    //     auth:SCHEMAS.ADMIN
    // }]
  }, {
    title: i18Common.MENU.TOP.AM,//일반관리
    subMenu: [{
      title: i18Common.MENU.SUB.AM.COMMUTE_TODAY, //"오늘의 근태 상황",
      hashTag: "#commutetoday",
      auth: SCHEMAS.USER
    }, {
      title: i18Common.MENU.SUB.AM.ADD_RAW_DATA, //"출입 기록 등록",
      hashTag: "#addrawdata",
      auth: SCHEMAS.ADMIN
    }, {
      title: i18Common.MENU.SUB.AM.RAW_DATA_LIST,//"출입 기록 조회",
      hashTag: "#rawdatalist",
      auth: SCHEMAS.USER
    }, {
      title: i18Common.MENU.SUB.AM.CREATE_DATA, //"근태 자료 생성",
      hashTag: "#createdata",
      auth: SCHEMAS.ADMIN
    }, {
      title: i18Common.MENU.SUB.AM.COMMUTE_MANAGER, //"근태 자료 관리",
      hashTag: "#commutemanager",
      auth: SCHEMAS.USER
    }, {
      title: i18Common.MENU.SUB.AM.COMMUTE_MANAGER_COMMENT, //"근태 Comment 내역 관리",
      hashTag: "#commutemanager/comment",
      subTag: ["/?/?"],
      auth: SCHEMAS.USER
    }, {
      title: i18Common.MENU.SUB.AM.REPORT_MANAGER, //"근태 상신(list)",
      hashTag: "#reportmanager",
      auth: SCHEMAS.USER,
      subTag: ["/?/?"],
      actionAuth: {
        save: SCHEMAS.ADMIN
      }
    }]

  }, {
    title: "근태 통계",
    subMenu: [{
      title: "지각현황",
      hashTag: "#abnormalsummary",
      auth: SCHEMAS.DEPT_BOSS
    }, {
      title: "휴가/초과근무 현황",
      hashTag: "#overtimereport",
      auth: SCHEMAS.DEPT_BOSS
    }]

  }, {
    title: "비품 관리",
    subMenu: [{
      title: "비품 코드 등록",
      hashTag: "#officeitemcode",
      auth: SCHEMAS.ADMIN
    }, {
      title: "비품 관리",
      hashTag: "#officeitemmanager",
      auth: SCHEMAS.ADMIN,
      actionAuth: {
        add: SCHEMAS.ADMIN,
        remove: SCHEMAS.ADMIN,
        edit: SCHEMAS.ADMIN
      }
    }, {
      title: "IP 관리",
      hashTag: "#ipassignedmanager",
      auth: SCHEMAS.ADMIN,
      actionAuth: {
        add: SCHEMAS.ADMIN,
        remove: SCHEMAS.ADMIN,
        edit: SCHEMAS.ADMIN,
        save: SCHEMAS.ADMIN
      }
    }, {
      title: "비품 할당 현황",
      hashTag: "#officeitemusage",
      auth: SCHEMAS.USER
    }, {
      title: "비품 이력 관리",
      hashTag: "#officeitemhistory",
      auth: SCHEMAS.ADMIN
    }]
  }, {
    title: i18Common.MENU.TOP.LM, //도서 관리
    subMenu: [{
      title: i18Common.MENU.SUB.LM.BOOK_LIBRARY, //"도서 목록",
      hashTag: "#booklibrary",
      auth: SCHEMAS.USER,
      area: SCHEMAS.AREA,
      actionAuth: {
        add: SCHEMAS.ADMIN,
        remove: SCHEMAS.ADMIN
      }
    }, {
      title: i18Common.MENU.SUB.LM.BOOK_RENT_HISTORY, // "대출 이력",
      hashTag: "#bookrenthistory",
      auth: SCHEMAS.USER,
      area: SCHEMAS.AREA
    }]
  }, {
    title: i18Common.MENU.TOP.RM,//회의실
    subMenu: [{
      title: "회의실 예약",
      hashTag: "#roomreserveweek",
      auth: SCHEMAS.USER,
      visible: true,
    }, {
      title: "회의실 예약 (월)",
      hashTag: "#roomreservemonth",
      auth: SCHEMAS.USER,
      visible: false,
    }, {
      title: "회의실 예약 (리스트)",
      hashTag: "#roomreservelist",
      auth: SCHEMAS.USER,
      visible: false,
    }, {
      title: "회의실 관리",
      hashTag: "#roomlist",
      auth: SCHEMAS.ADMIN,
      actionAuth: {
        add: SCHEMAS.ADMIN,
        edit: SCHEMAS.ADMIN,
        remove: SCHEMAS.ADMIN
      }
    }]
  }];
  return _menu;

});



