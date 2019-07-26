define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'grid',
  'schemas',
  'util',
  'dialog',
  'csvParser',
  'cmoment',
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
  'models/common/RawDataModel',
  'collection/common/RawDataCollection',
  'models/sm/UserModel',
  'collection/sm/UserCollection',
  'views/component/ProgressbarView',
], function ($, _, Backbone, BaseView, Grid, Schemas, Util, Dialog, csvParser, Moment, Code, i18nCommon,
  HeadHTML, ContentHTML, LayoutHTML, RowHTML, DatePickerHTML, RowButtonContainerHTML, RowButtonHTML, RowComboHTML,
  SessionModel, RawDataModel, RawDataCollection, UserModel, UserCollection,
  ProgressbarView) {
    var RawDataView = BaseView.extend({
      el: $(".main-container"),
      setSearchParam: function (searchParam) {
        this.searchParam = searchParam; // url + 검색 조건으로 페이지 이동시 조건감들 {id: id, date: date}
      },

      initialize: function () {
        $(this.el).html('');
        $(this.el).empty();
        this.rawDataCollection = new RawDataCollection();

        this.departmentCollection = null;
        this.userCollection = new UserCollection();
        this.userCollection.fetch();

        this.gridOption = {
          el: "rawDataContent",
          id: "rawDataTable",
          column: [
            { data: "department", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.DEPARTMENT },
            { data: "name", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.NAME },
            { data: "char_date", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.TIME },
            { data: "type", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.TYPE },
            { data: "members_ip_pc", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.MEM_IP_IC },
            { data: "ip_pc", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.IP },
            { data: "members_ip_office", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.MEM_IP_OFFICE },
            { data: "ip_office", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.IP_PC },
            { data: "platform_type", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.PLATFORM_TYPE },
            {
              data: "need_confirm", "title": i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.NEED_CONFIRM,
              render: function (data, type, full, meta) {
                return (full.need_confirm == 1) ? i18nCommon.RAW_DATA_LIST.MSG.OK : i18nCommon.RAW_DATA_LIST.MSG.NOK;
              }
            }
          ],
          dataschema: ["name", "department", "char_date", "type", "ip_office", "ip_pc", "members_ip_pc", "members_ip_office", "platform_type"],
          collection: this.rawDataCollection,
          detail: true,
          fetch: false,
          buttons: ["search"],
          order: [[3, "desc"]]
        };

        if (SessionModel.getUserInfo().admin >= Schemas.DEPT_BOSS) {
          this.gridOption.buttons.push({ type: "myRecord", name: "myRecord", filterColumn: ["name"], tooltip: "", })
        }
        /*
              var dept_code = SessionModel.getUserInfo().dept_code;
              var admin = SessionModel.getUserInfo().admin;
              
              // 경영지원 팀 인 경우
              if ( dept_code == '1000' || admin == Schemas.ADMIN ) {
                this.gridOption.column.push( { data : "ip_office", 		"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.IP } );
                this.gridOption.column.push( { data : "ip_pc",		"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.IP_PC } );
              }
  
              // 경영 지원팀 또는 수원 사업자의 경우 컬럼을 추가
              if ( dept_code == '1000' || Code.isSuwonWorker(dept_code) || admin == Schemas.ADMIN) {
                this.gridOption.column.push( { data : "need_confirm", 	"title" : i18nCommon.RAW_DATA_LIST.GRID_COL_NAME.NEED_CONFIRM,
                  render: function(data, type, full, meta) {
                        return (full.need_confirm == 1)? i18nCommon.RAW_DATA_LIST.MSG.OK : i18nCommon.RAW_DATA_LIST.MSG.NOK ;
                      }
                    });
              }
              */
      },
      getRawData: function () {
        var startDate = Moment($(this.el).find("#rdFromDatePicker").data("DateTimePicker").getDate().toDate());
        var endDate = Moment($(this.el).find("#rdToDatePicker").data("DateTimePicker").getDate().toDate());
        var deptCode = $(this.el).find("#rdCombo").val();

        if (endDate.diff(startDate, 'days') > 92) {
          Dialog.warning("검색 기간이 초과되었습니다. (최대 3개월)");
        } else {
          this.renderTable(startDate, endDate, deptCode);
        }
      },
      renderTable: function (startDate, endDate, deptCode) {
        var that = this;
        Dialog.loading({
          action: function () {
            var dfd = new $.Deferred();
            that.rawDataCollection.fetch({
              data: { start: startDate.format("YYYY-MM-DD"), end: endDate.format("YYYY-MM-DD"), dept: deptCode },
              success: function () {
                dfd.resolve();
              }, error: function () {
                dfd.reject();
              }
            });
            return dfd.promise();
          },

          actionCallBack: function (res) {//response schema
            that.grid.render();
          },
          errorCallBack: function (response) {
            Dialog.error(i18nCommon.RAW_DATA_LIST.MSG.LOADING_FAIL);
          },
        });
      },
      events: {
        'click #rdSearchBtn': 'onClickSearchBtn'
      },
      render: function () {
        var _view = this;
        var _headSchema = Schemas.getSchema('headTemp');
        var _headTemp = _.template(HeadHTML);
        var _layout = $(LayoutHTML);
        var _head = $(_headTemp(_headSchema.getDefault({
          title: i18nCommon.RAW_DATA_LIST.TITLE,
          subTitle: i18nCommon.RAW_DATA_LIST.SUB_TITLE
        })
        ));

        _head.addClass("no-margin");
        _head.addClass("relative-layout");

        var _content = $(ContentHTML).attr("id", this.gridOption.el);
        var _row = $(RowHTML);
        var _datepickerRange = $(_.template(DatePickerHTML)(
          {
            obj:
            {
              fromId: "rdFromDatePicker",
              toId: "rdToDatePicker"
            }
          })
        );
        var _btnContainer = $(_.template(RowButtonContainerHTML)({
          obj: {
            id: "rdBtnContainer"
          }
        })
        );

        var _searchBtn = $(_.template(RowButtonHTML)({
          obj: {
            id: "rdSearchBtn",
            label: i18nCommon.RAW_DATA_LIST.SEARCH_BTN
          }
        })
        );

        var _combo = $(_.template(RowComboHTML)({
          obj: {
            id: "rdCombo",
            label: "부서"
          }
        })
        );

        _searchBtn.click(function (e) {
          _view.getRawData();
        });

        _btnContainer.append(_searchBtn);

        _row.append(_datepickerRange);
        if (SessionModel.getUserInfo().admin >= Schemas.DEPT_BOSS) {
          _row.append(_combo);
        }
        _row.append(_btnContainer);

        _layout.append(_head);
        _layout.append(_row);
        _layout.append(_content);

        $(this.el).append(_layout);

        var today = new Date();
        $(this.el).find("#rdFromDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          defaultDate: Moment(today).add(-7, "days").format("YYYY-MM-DD")
        });

        $(this.el).find("#rdToDatePicker").datetimepicker({
          pickTime: false,
          language: "ko",
          todayHighlight: true,
          format: "YYYY-MM-DD",
          defaultDate: Moment(today).format("YYYY-MM-DD")
        });

        var dept = Code.getCodes(Code.DEPARTMENT);
        $(this.el).find("#rdCombo").append("<option>" + "전체" + "</option>");
        for (var i = 0; i < dept.length; i++) {
          if (dept[i].name != "임원" && dept[i].name != "무소속")
            $(this.el).find("#rdCombo").append("<option>" + dept[i].name + "</option>");
        }
        $(this.el).find("#rdCombo").val(SessionModel.getUserInfo().dept_name);

        if (SessionModel.getUserInfo().id == "130702" || SessionModel.getUserInfo().dept_name == "임원")
          $(this.el).find("#rdCombo").val("전체");
        else
          $(this.el).find("#rdCombo").val(SessionModel.getUserInfo().dept_name);


        var _gridSchema = Schemas.getSchema('grid');

        this.grid = new Grid(_gridSchema.getDefault(this.gridOption));
        this.grid.render();
        if (Util.isNotNull(this.searchParam)) { // URL로 이동한 경우  셋팅된 검색 조건이 있을 경우 
          $(this.el).find("#rdFromDatePicker").data("DateTimePicker").setDate(this.searchParam.date);
          $(this.el).find("#rdToDatePicker").data("DateTimePicker").setDate(this.searchParam.date);
        }
        this.selectInOut();
        this.getRawData();



        return this;
      },
      onClickSearchBtn: function () {
        this.selectInOut();
      },
      getSearchForm: function () {	// 검색 조건
        var data = {
          startDate: $(this.el).find("#rdFromDatePicker").data("DateTimePicker").getDate().format("YYYY-MM-DD"),
          endDate: $(this.el).find("#rdToDatePicker").data("DateTimePicker").getDate().format("YYYY-MM-DD")
        }

        if (Util.isNotNull(this.searchParam)) { // URL로 이동한 경우  셋팅된 검색 조건이 있을 경우 
          data.id = this.searchParam.id;
        }

        if (Util.isNull(data.startDate)) {
          alert("검색 시작 날짜를 선택해주세요");
          return null;
        } else if (Util.isNull(data.endDate)) {
          alert("검색 끝 날짜를 선택해주세요");
          return null;
        }

        return data;
      },
      selectInOut: function () {	// 데이터 조회
        var data = this.getSearchForm();
        if (Util.isNull(data)) {
          return;
        }

        var _this = this;
        this.rawDataCollection.fetch({
          data: data,
          success: function (result) {
            _this.grid.render();
          },
          error: function (result) {
            alert("데이터 조회가 실패했습니다.");
          }
        });
      }

    });
    return RawDataView;
  });
