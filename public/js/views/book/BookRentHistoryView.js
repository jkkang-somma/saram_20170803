define([
    'jquery',
    'underscore',
    'backbone',
    'cmoment',
    'util',
    'core/BaseView',
    'grid',
    'schemas',
    'i18n!nls/common',
    'dialog',
    'text!templates/layout/default.html',
    'text!templates/default/head.html',
    'text!templates/default/row.html',
    'text!templates/default/content.html',
    'text!templates/book/bookRow.html',
    'text!templates/default/rowdatepickerRange.html',
    'text!templates/default/rowbuttoncontainer.html',
    'text!templates/default/rowbutton.html',
    'models/sm/SessionModel',
    'models/book/BookRentModel',
    'collection/book/BookRentHistoryCollection'

], function(
    $,
    _,
    Backbone,
    Moment,
    Util,
    BaseView,
    Grid,
    Schemas,
    i18Common,
    Dialog,
    LayoutHTML,
    HeadHTML,
    RowHTML,
    ContentHTML,
    BookRowHTML,
    DatePickerHTML,
    RowButtonContainerHTML,
    RowButtonHTML,
    SessionModel,
    BookRentModel,
    BookRentHistoryCollection
) {
    var _currentFilter = 0;
    var BookLibraryView = BaseView.extend({
        el: ".main-container",
        initialize: function() {
            this.bookRentHistoryCollection = new BookRentHistoryCollection();
            this.option = {
                el: "bookHistory_content",
                id: "bookHistoryTable",
                column: [{
                        "title": i18Common.BOOK_LIST.NAME,
                        "render": function(data, type, row) {
                            return _.template(BookRowHTML)(row);
                        }
                    },
                    {
                        "title": i18Common.BOOK_LIST.MANAGE_NO,
                        "render": function(data, type, row) {
                            return row.manage_no;
                        }
                    },
                    {
                        "title": i18Common.BOOK_LIST.RENT_USER,
                        "render": function(data, type, row) {
                            return row.name;
                        }
                    },
                    {
                        "title": i18Common.BOOK_LIST.RENT_STATE,
                        "render": function(data, type, row) {
                            return (row.state > 0) ? i18Common.BOOK_LIST.RENT_STATE_RENTED : i18Common.BOOK_LIST.RENT_STATE_RETURNED;
                        }
                    },
                    {
                        "title": i18Common.BOOK_LIST.MODIFY_DATE,
                        "render": function(data, type, row) {
                            return row.modify_date;
                        }
                    }
                ],
                dataschema: ["book_name", "manage_no", "name", "state", 'modify_date'],
                collection: this.bookRentHistoryCollection,
                detail: true,
                view: this,
                fetch: false,
                order: [
                    [5, "asc"]
                ]
            };
        },
        render: function() {

            var _view = this;
            var _headSchema = Schemas.getSchema('headTemp');
            var _headTemp = _.template(HeadHTML);
            var _layOut = $(LayoutHTML);
            //Head 
            var _head = $(_headTemp(_headSchema.getDefault({ title: i18Common.PAGE.TITLE.BOOK_MANAGER, subTitle: i18Common.PAGE.SUB_TITLE.BOOK_RENT_HISTORY })));
            _head.addClass("no-margin");
            _head.addClass("relative-layout");

            var _row = $(RowHTML);

            var _datepickerRange = $(_.template(DatePickerHTML)({
                obj: {
                    fromId: "rdFromDatePicker",
                    toId: "rdToDatePicker"
                }
            }));
            var _btnContainer = $(_.template(RowButtonContainerHTML)({
                obj: {
                    id: "rdBtnContainer"
                }
            }));

            var _searchBtn = $(_.template(RowButtonHTML)({
                obj: {
                    id: "rdSearchBtn",
                    label: i18Common.RAW_DATA_LIST.SEARCH_BTN
                }
            }));

            _searchBtn.click(function(e) {
                _view.loadingView();
            });

            _btnContainer.append(_searchBtn);
            _row.append(_datepickerRange);
            _row.append(_btnContainer);

            var _content = $(ContentHTML).attr("id", this.option.el);

            _layOut.append(_head);
            _layOut.append(_row);
            _layOut.append(_content);
            $(this.el).html(_layOut);

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

            //grid button add;

            var _filterText = ['전체', '대출', '반납'];
            var _buttons = ["search"];
            _buttons.push({
                type: "custom",
                name: "filter",
                tooltip: "상태",
                filterBtnText: _filterText,
                click: function(_grid, _button) {
                    var filters = [
                        function() {
                            return true;
                        },
                        function(data) {
                            return (data[4].indexOf("대출") != -1) ? true : false;
                        },
                        function(data) {
                            return (data[4].indexOf("반납") != -1) ? true : false;
                        }
                    ];

                    if (_currentFilter == 2) {
                        _currentFilter = 0;
                    }
                    else {
                        _currentFilter++;
                    }

                    _button.html(_filterText[_currentFilter]);
                    _grid.setBtnText(_button, _filterText[_currentFilter]);
                    _grid.filtering(function(data) {
                        var fn = filters[_currentFilter];
                        return fn(data);
                    }, "state");
                }
            });

            this.option.buttons = _buttons;
            var _gridSchema = Schemas.getSchema('grid');
            this.grid = new Grid(_gridSchema.getDefault(this.option));

            this.loadingView();
        },
        loadingView: function() {
            var startDate = Moment($(this.el).find("#rdFromDatePicker").data("DateTimePicker").getDate().toDate());
            var endDate = Moment($(this.el).find("#rdToDatePicker").data("DateTimePicker").getDate().toDate());
            var _view = this;
            Dialog.loading({
                action: function() {
                    var dfd = new $.Deferred();
                    _view.bookRentHistoryCollection.fetch({
                        data: { start: startDate.format("YYYY-MM-DD"), end: endDate.format("YYYY-MM-DD") },
                        success: function() {
                            dfd.resolve();
                        },
                        error: function() {
                            dfd.reject();
                        }
                    });
                    return dfd.promise();
                },
                actionCallBack: function(res) { //response schema
                    _view.grid.render();
                },
                errorCallBack: function(response) {
                    Dialog.error(i18Common.COMMUTE_RESULT_LIST.MSG.GET_DATA_FAIL);
                },
            });
        }
    });
    return BookLibraryView;
});
