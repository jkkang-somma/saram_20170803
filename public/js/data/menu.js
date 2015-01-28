// 각 View 마다 동일한 변수나 function 이 있을경우 이곳에 추가하여 사용
// 각 View는 BaseView 를 상속 하여 생성한다.
define([
    'jquery',
	'underscore',
	'i18n!nls/common',
], function($, _, i18Common){
    var ADMIN=1,USER=0;
	var _menu=[{
        title:i18Common.MENU.TOP.SM, //일반관리
        subMenu:[{
            title:i18Common.MENU.SUB.SM.USER, //사용자 관리
            hashTag:"#usermanager",
            auth:USER,
            actionAuth:{
                add:ADMIN,
                remove:ADMIN,
                edit:ADMIN
            }
        },{
            title:i18Common.MENU.SUB.SM.HOLIDAY, //휴일 관리
            hashTag:"#holidaymanager",
            auth:ADMIN
        },{
            title:i18Common.MENU.SUB.SM.VACATION, //연차 관리
            hashTag:"#vacation",
            auth:USER
        },{
            title:i18Common.MENU.SUB.SM.REPORTCOMMUTE, //근태 레포트 
            hashTag:"#reportCommute",
            auth:USER
        }]
    },{
        title:i18Common.MENU.TOP.AM,//일반관리
        subMenu:[{
            title:i18Common.MENU.SUB.AM.ADD_RAW_DATA, //"출입 기록 등록",
            hashTag:"#addrawdata",
            auth:ADMIN
        },{
            title:i18Common.MENU.SUB.AM.RAW_DATA_LIST,//"출입 기록 조회",
            hashTag:"#rawdatalist",
            auth:USER
        },{
            title:i18Common.MENU.SUB.AM.CREATE_DATA, //"근태 자료 생성",
            hashTag:"#createdata",
            auth:ADMIN
        },{
            title:i18Common.MENU.SUB.AM.COMMUTE_MANAGER, //"근태 자료 관리",
            hashTag:"#commutemanager",
            auth:USER
        },{
            title:i18Common.MENU.SUB.AM.COMMUTE_MANAGER_COMMENT, //"근태 Comment 내역 관리",
            hashTag:"#commutemanager/comment",
            auth:USER
        },{
            title:i18Common.MENU.SUB.AM.REPORT_MANAGER, //"근태 상신(list)",
            hashTag:"#reportmanager",
            auth:USER
        }]
    }];
	return _menu;

});



