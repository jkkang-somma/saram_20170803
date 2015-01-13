// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'datatables',
  'util',
  //'fnFindCellRowIndexes',
  'text!templates/component/grid.html',
  ], function($, _, Backbone, log, Datatables, Util, GridHTML){
    var LOG=log.getLogger('Grid');
    var gridId=0;
    var Grid = Backbone.View.extend({
    	initialize:function(options){
    	    var grid=this;
    	    $(window).on("resize", function(){
    	        LOG.debug("siba");
    	        grid.updateCSS(grid);     
    	    });
    	    
            this.options=options;
            this.options.format=this.format;
            
            if (_.isUndefined(this.options.id) || _.isNull(this.options.id)){
                this.options.id = "grid-"+(gridId++);
            }
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'getSelectItem');
    		_.bindAll(this, 'removeRow');
    		_.bindAll(this, 'search');
    		this.render();
    	},
    	updateCSS:function(){
    	    var width=$(window).width();
    	    var _padding=38;
    	    var API=this.DataTableAPI;

            var _columns = this.columns;
            var _cTotallWidth=0;
            var column;
            if (width > 768) {
                for (var index in _columns){
                    column=API.column(index);
                    column.visible(index > 0);
                }
            } else if ( width  < 768) {
                
                API.column(index).visible(true);
                 for (var index in _columns){
                    column=API.column(index);
                    
                    var header=column.header();
                    //var _pWidth= header.parentNode.offsetWidth;
                    var _cWidth = header.offsetWidth;
                    _cTotallWidth=_cTotallWidth+_cWidth;
                    
                    if (width < _cTotallWidth+_padding){
                        column.visible(false);
                    } else {
                        column.visible(true);
                    }
                }
            }
    	},
    	format : function (rowData) {
    	    var _result=$('<div></div>');
    	    var _subTable=$('<table class="subTable" cellpadding="5" cellspacing="0" border="0" ></table>');
    	    
    	    for (var name in rowData){
    	        var index=_.indexOf(this.dataschema, name);
    	        if (-1 < index){
    	            _subTable.append(
        	            '<tr>'
        	                +'<td>'+this.column[index]+'</td>'
                            +'<td>'+rowData[name]+'</td>'
                        +'</tr>'
        	        );
    	        }
    	        
    	    }
    	    _result.append(_subTable);
    	    
            return _result.html();
        },
    	getSelectItem:function(){//선택된 row 가져오기
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectItem=this.DataTableAPI.row('.selected').data();
    	    return selectItem;
    	},
    	removeRow:function(item){//선택된 row 삭제
    	    this.DataTableAPI.row('.selected').remove().draw( false );
    	},
    	addRow:function(model){//add row
    	    this.DataTableAPI.row.add(model).draw();
    	},
    	search:function(value, regex, smart){
    	    this.DataTableAPI.search(
                value,
                _.isUndefined(regex)?false:regex,
                _.isUndefined(smart)?false:smart
            ).draw();
    	},
    	draw:function(){
    	    var _grid = this;
    	    if($.fn.DataTable.isDataTable($("#"+this.options.el).find("#"+this.options.id))){//
    	        $("#"+this.options.el).find("#"+this.options.id).parent().remove();
    	    }
    	    
    	    var _columns=[];
    	    if(this.options.detail){
                _columns.push({
                    "className":      'details-control',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ''
                });
    	    }
            
            
    	    for (var i=0; i < this.options.column.length; i++){// 컬럼 만들기.
    	        _columns.push({ "title":this.options.column[i], "data" : this.options.dataschema[i] });
    	    }
    	    
    	    this.columns= _columns;
    	    
    	    //dataTable reander
    	    var _dataTable=$(GridHTML);
            $("#"+this.options.el).append(_dataTable);
    	    _dataTable.attr("id", this.options.id);
            _dataTable.dataTable({
                "lengthChange": false,
                "sDom": '<"top">rt<"bottom"ip>',// _dataTable display controll
     	        "data" : this.options.collection.toJSON(),
     	        "columns" : _columns
     	    });
     	    
     	    //ROW click
     	    _dataTable.find("tbody").on( 'click', 'tr', function () {
                if ( $(this).hasClass('selected') ) {
                    $(this).removeClass('selected');
                }
                else {
                    _dataTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            } );
            
            //dataTableAPI
            var _tableAPI=_dataTable.dataTable().api();
            
            if(this.options.detail){//상세 페이지.
                $("#"+this.options.id+" tbody").on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = _tableAPI.row( tr );
                
                    if ( row.child.isShown() ) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        // Open this row
                        row.child( _grid.options.format(row.data())).show();
                        tr.addClass('shown');
                    }
                });
            }
            this.DataTableAPI=_tableAPI;
            this.updateCSS();
    	},
    	render:function(){
    	   var grid = this;
    	   if(Util.isNull(this.options.fetch) || this.options.fetch === true){
        	   this.options.collection.fetch({
        	       success: function(){
        	           grid.draw();
        	       }
        	   });    
    	   }else{
    	       grid.draw();
    	   }
    	   return grid;
     	}
    });
    return Grid;
});