/*global requirejs*/
// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18

define([
  'jquery',
  'underscore',
  'backbone',
  'animator',
  'util',
  'log',
  'dialog',
  'data/menu',
  'i18n!nls/common',
  'models/sm/SessionModel',
  'core/BaseRouter',
  'views/LoginView',
  'views/NavigationView'
], function (
  $,
  _,
  Backbone,
  animator,
  Util,
  log,
  Dialog,
  Menu,
  i18Common,
  SessionModel,
  BaseRouter,
  LoginView,
  NavigationView
) {
    var LOG = log.getLogger('MainRouter');
    var mainContainer = '.main-container';
    // var loginContainer='.login-container';
    var LOGIN = 'login';

    var Router = BaseRouter.extend({
      routes: {
        'usermanager': 'showUserList',
        'departmentmanager': 'showDepartmnet',
        'partmanager': 'showPart',
        'organization': 'showOrganization',
        'gis': 'showGis',
        'gisHistory': 'showGisHistory',
        'positionmanager': 'showPosition',
        'userpic': 'showUserPic',
        'documentlist': 'showDocument',
        'bookdocument': 'showBookDocument',
        'addrawdata': 'showAddRawData',
        'createdata': 'showCreateData',
        'holidaymanager': 'showHolidayManager',
        'commutemanager': 'showCommuteManager',
        'commutemanager/:date': 'showCommuteManagerByDate',
        'commentmanager': 'showCommuteComment',
        'commentmanager/:id/:date': 'showCommuteCommentListCount',
        'commentmanager/:flag': 'showCommuteCommentListCount2',
        'vacation': 'showVacation',
        'rawdatalist': 'showRawdata',
        'rawdatalist/:id/:date': 'showRawdataList',
        'commutetoday': 'showCommuteToday',
        'reportmanager': 'showReportManager',
        'reportmanager/:sdate/:edate': 'showReportManagerParam',
        'accessIn': 'accessIn',
        'accessOut': 'accessOut',
        'allreport': 'showAllReport',
        'roomreserveweek': 'showRoomReserveWeek',
        'roomreservemonth': 'showRoomReserveMonth',
        'roomreservelist': 'showRoomReserveList',
        'roomlist': 'showRoomList',
        'officeitemcode': 'showOfficeItemCode',
        'officeitemmanager': 'showOfficeItemManager',
        'ipassignedmanager': 'showIpAssignedManager',
        'officeitemusage': 'showOfficeItemUsage',
        'officeitemhistory': 'showOfficeItemHistory',
        'deptsummary': 'showDeptSummary',
        'booklibrary': 'showBookLibrary',
        'bookrenthistory': 'showBookRentHistory',
        'bookmanager': 'showBookManager',
        'abnormalsummary': 'showAbnormalSummary',
        'overtimereport': 'showOvertimeReport',
        '*actions': 'showHome',
      },
      initialize: function (option) {
        var affterCallback, beforeCallback;
        if (Util.isNotNull(option)) {
          for (var name in option) {
            if (name == "affterCallback" || name == "beforeCallback") {
              affterCallback = option[name];
            }
          }
        }
        if (Util.isNotNull(beforeCallback) && _.isFunction(beforeCallback)) {
          beforeCallback();
        }

        if (Util.isNotNull(affterCallback) && _.isFunction(affterCallback)) {
          affterCallback();
        }
      },

      before: function (url, next) {
        var _nextURL = "#" + url;
        var sessionUser = SessionModel.getUserInfo();

        var auth = sessionUser.admin;
        LOG.debug(_nextURL);
        if (auth == 1 || _nextURL == "#") {//어드민일 경우
          return next();
        }

        var subMenuArr = _.pluck(Menu, "subMenu");

        var subMenu = _.flatten(subMenuArr);

        var _authArr = _.pluck(subMenu, "auth");
        var _urlArr = _.pluck(subMenu, "hashTag");

        var _areaArr = _.pluck(subMenu, "area");

        var index = _.indexOf(_urlArr, _nextURL);

        if (_authArr[index] <= auth) { // 권한 있을 시
          LOG.debug("next");
          return next();
        } else if (_areaArr[index] == '서울') {
          LOG.debug("area next");
          return next();
        } else {//권한 없을 때
          var isSubTag = false;
          for (var index in _urlArr) {
            var subIndex = _nextURL.indexOf(_urlArr[index]);
            if (subIndex > -1) {
              if (!_.isUndefined(subMenu[index].subTag)) {
                var configURL = _urlArr[index] + subMenu[index].subTag;
                var configURLTokenArr = configURL.split("/");
                var nextURLTokenArr = _nextURL.split("/");

                if (configURLTokenArr.length == nextURLTokenArr.length) {
                  isSubTag = true;
                }
              }
            }
          }

          if (isSubTag) {
            return next();
          } else {
            LOG.debug("back");
            window.history.back();
          }
        }
      },

      after: function () {
      },

      changeView: function (viewUrl, authUrl, callback, initParam) {
        LOG.debug("Initalize changeView");
        if (this.currentView)
          this.currentView.close();

        var _this = this;
        requirejs([viewUrl], function (View) {
          var view;
          if (!_.isUndefined(initParam)) {
            view = new View(initParam);
          } else {
            view = new View();
          }

          if (_.isFunction(callback)) {
            callback(view);
          }
          _this.currentView = view;
          //view.initialize();
          if (!_.isUndefined(authUrl)) {
            var sessionUser = SessionModel.getUserInfo();

            var auth = sessionUser.admin;

            var subMenuArr = _.pluck(Menu, "subMenu");
            var subMenu = _.flatten(subMenuArr);

            var _urlArr = _.pluck(subMenu, "hashTag");
            var index = _.indexOf(_urlArr, authUrl);
            var attrKeys = _.keys(subMenu[index]);
            var hasActionAuth = _.indexOf(attrKeys, "actionAuth");
            if (hasActionAuth != -1) {
              var actionAuth = subMenu[index].actionAuth;
              var _configActionAuth = {};

              for (var name in actionAuth) {//버튼 권한별 셋팅.
                _configActionAuth[name] = actionAuth[name] <= auth ? true : false;
              }

              view.setActionAuth(_configActionAuth);
            }
          }

          view.render.apply(view, []);
          animator.animate($(view.el), animator.FADE_IN);

          // side-container
          if ($('.side-container').children().length <= 0 && $(window).width() > 768
            && viewUrl.indexOf('dashboard') < 0) {
            //					$('body').css('overflow', 'hidden');
            $('.main-container').css('height', '');
          } else {
            //					$('body').css('overflow', 'auto');
            $('.main-container').css('height', 'auto');
          }
        });
      },

      showUserList: function (r) {
        var url = 'views/sm/UserListView';
        this.changeView(url, "#usermanager");
      },

      showAddRawData: function () {
        var url = 'views/RawData/AddRawDataView';
        this.changeView(url);
      },

      showCommuteToday: function () {
        var url = 'views/cm/CommuteTodayView';
        this.changeView(url);
      },

      showCreateData: function () {
        var url = 'views/cm/CreateDataView';
        this.changeView(url);
      },

      showHome: function () {
        var url = 'views/dashboard/DashBoardView';
        this.changeView(url, undefined, undefined, { el: mainContainer });
      },
      showHolidayManager: function () {
        var url = 'views/Holiday/HolidayManagerView';
        this.changeView(url);
      },

      showCommuteManager: function () {
        var url = 'views/cm/CommuteListView';
        this.changeView(url);
      },

      showCommuteManagerByDate: function (date) {
        var url = 'views/cm/CommuteListView';
        var callback = function (view) {
          view.setSearchDate(date);
        };
        this.changeView(url, undefined, callback);
      },

      showVacation: function () {
        var url = 'views/vacation/VacationView';
        this.changeView(url);
      },

      showCommuteComment: function () {
        var url = 'views/cm/CommuteCommentView';
        this.changeView(url);
      },

      showCommuteCommentListCount: function (id, date) { // url + 검색 조건을 토한 페이지 이동 
        var url = 'views/cm/CommuteCommentView';
        var callback = function (view) {
          view.setSearchParam({ "id": id, "date": date });
        };
        this.changeView(url, undefined, callback);
      },

      showCommuteCommentListCount2: function (flag) { // url + 검색 조건을 토한 페이지 이동 
        var url = 'views/cm/CommuteCommentView';
        var callback = function (view) {
          view.setSearchParamOnlySubmit();
        };
        this.changeView(url, undefined, callback);
      },

      showRawdata: function () {
        var url = 'views/RawData/RawDataView';
        this.changeView(url);
      },
      showRawdataList: function (id, date) { // url + 검색 조건을 토한 페이지 이동 
        var url = 'views/RawData/RawDataView';
        var callback = function (view) {
          view.setSearchParam({ "id": id, "date": date });
        };
        this.changeView(url, undefined, callback);
      },

      showReportManager: function () {
        var url = 'views/rm/ReportListView';
        this.changeView(url, "#reportmanager");
      },

      showReportManagerParam: function (sdate, edate) {
        var url = 'views/rm/ReportListView';
        var callback = function (view) {
          view.settingParam = { start: sdate, end: edate };
        }
        this.changeView(url, "#reportmanager", callback);
      },
      showUserPic: function () {
        var url = 'views/sm/UserPicView';
        this.changeView(url);
      },
      showDocument: function () {
        var url = 'views/sm/DocumentListView';
        this.changeView(url, 'documentlist');
      },
      showBookDocument: function () {
        var url = 'views/sm/BookDocumentView';
        this.changeView(url, 'bookdocument');
      },
      showDepartmnet: function () {
        var url = 'views/sm/DepartmentListView';
        this.changeView(url, '#departmentmanager');
      },
      showPart: function () {
        var url = 'views/sm/PartListView';
        this.changeView(url, '#partmanager');
      },
      showPosition: function () {
        var url = 'views/sm/PositionListView';
        this.changeView(url, '#positionmanager');
      },
      showOrganization: function () {
        var url = 'views/sm/OrganizationView';
        this.changeView(url, '#organization');
      },
      showGis: function () {
        var url = 'views/gis/gisView';
        this.changeView(url, '#gis');
      },
      showGisHistory: function () {
        var url = 'views/gis/gisHistoryView';
        this.changeView(url, '#gisHistory');
      },
      showAllReport: function () {
        var url = 'views/rm/AllReportView';
        this.changeView(url, '#allreport');
      },
      showRoomReserveWeek: function () {
        var url = 'views/room/RoomReserveView';
        this.changeView(url, "#roomreserveweek");
      },
      showRoomReserveMonth: function () {
        var url = 'views/room/RoomReserveMonthView';
        this.changeView(url, "#roomreservemonth");
      },
      showRoomReserveList: function () {
        var url = 'views/room/RoomReserveListView';
        this.changeView(url, "#roomreservelist");
      },
      showRoomList: function () {
        var url = 'views/room/RoomListView';
        this.changeView(url, "#roomlist");
      },
      showOfficeItemCode: function () {
        var url = 'views/officeitem/OfficeItemCodeView';
        this.changeView(url, '#officeitemcode');
      },
      showOfficeItemManager: function () {
        var url = 'views/officeitem/OfficeItemManagerView';
        this.changeView(url, '#officeitemmanager');
      },
      showIpAssignedManager: function () {
        var url = 'views/officeitem/IpAssignedManagerView';
        this.changeView(url, '#ipassignedmanager');
      },
      showOfficeItemUsage: function () {
        var url = 'views/officeitem/OfficeItemUsageView';
        this.changeView(url, '#officeitemusage');
      },
      showOfficeItemHistory: function () {
        var url = 'views/officeitem/OfficeItemHistoryView';
        this.changeView(url, '#officeitemhistory');
      },
      showAbnormalSummary: function () {
        var url = 'views/statistics/AbnormalSummaryView';
        this.changeView(url);
      },
      showBookLibrary: function () {
        var url = 'views/book/BookLibraryView';
        this.changeView(url, "#booklibrary");
      },
      showBookRentHistory: function () {
        var url = 'views/book/BookRentHistoryView';
        this.changeView(url, "#bookrenthistory");
      },
      showBookManager: function () {
        var url = 'views/book/BookManagerView';
        this.changeView(url, "#bookmanager");
      },
      showOvertimeReport: function () {
        var url = 'views/statistics/OvertimeReportView';
        this.changeView(url);
      }
    });
    return Router;
  });