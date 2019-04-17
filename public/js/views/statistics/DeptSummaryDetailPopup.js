define([ 
    'jquery',
    'underscore',
    'backbone',
    'util',
    'schemas',
    'grid',
    'dialog',
    'datatables',
    'code',
    'cmoment',
    'collection/rm/ApprovalCollection',
    'core/BaseView',
    'views/component/ProgressbarView',
    'text!templates/default/content.html',
], function(
$, _, Backbone, Util, Schemas,
Grid, Dialog, Datatables, Code, Moment,
ApprovalCollection,
BaseView, ProgressbarView,
ContentHTML
) {

var DeptSummaryDetailPopup = Backbone.View.extend({
    initialize : function(data) {
        this.searchData = data;
        this.gridOption = {
            el:"DeptSummaryDetail_content",
            id:"DeptSummaryDetailGrid",
            column:[
                { data : "date",        "title" : "일자" },
                { data : "name",        "title" : "이름" },
                { data : "work_type",   "title" : "구분" }
            ],
            detail: true,
            collection:null,
            fetch: false,
            order : [[1, "asc"]]
        };
    },
    events: {
        'view:rendered' : "renderGrid"
    },
    render: function(el) {
        var _this = this;

        var dfd= new $.Deferred();
        if (!_.isUndefined(el)) this.el=el;
        
        var _content=$(ContentHTML).attr("id", this.gridOption.el);
        $(this.el).html(_content);
        
        // this.progressbar = new ProgressbarView();
        // $(this.el).append(this.progressbar.render());
        // this.progressbar.disabledProgressbar(false);
        
        dfd.resolve(this);
        return dfd.promise();
    },

    afterRender : function(){
        this.drawDetpDetailData();
    },
    
    drawDetpDetailData : function(){
        var _this = this;

        var data = {
            fromDate    : this.searchData.fromDate, 
            toDate      : this.searchData.toDate, 
            dept        : this.searchData.dept, 
            work_type   : this.searchData.type
        };
        Util.ajaxCall("/statistics/abnormal/detail", "GET", data).then(function(result){
            _this.gridOption.collection = {
                data:result,
                toJSON : function(){
                    return result;
                }
            };
            var _gridSchema=Schemas.getSchema('grid');
            _this.grid= new Grid(_gridSchema.getDefault(_this.gridOption));
            // $("#DeptSummaryDetail_content").css("height",500); // 다이얼로그 기본 높이 사용하지 않을 경우 지정 필요
        });
    }
});

return DeptSummaryDetailPopup;
});