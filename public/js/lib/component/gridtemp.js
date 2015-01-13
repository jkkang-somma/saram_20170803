// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'datatables',
  //'fnFindCellRowIndexes',
  'text!templates/component/grid.html',
  ], function($, _, Backbone, log, Datatables, GridHTML){
    var LOG=log.getLogger('Grid');
    var gridId=0;
    var Grid = Backbone.View.extend({
        events:{
    	},
    	initialize:function(options){
    	   // $(window).on("resize", function(){
    	   //     grid.updateCSS(grid);     
    	   // });
            this.options=options;
    // 		_.bindAll(this, 'render');
    // 		_.bindAll(this, 'getSelectItem');
    // 		_.bindAll(this, 'removeRow');
    		
    	},
    // 	updateCSS:function(grid){
    // 	    var width=$(window).width();
    // 	    var API=grid.DataTableAPI;
    // 	    LOG.debug(width);
    // 	   // $("#"+grid.options.el+" tbody").on( 'click', 'td', function () {
    //     //                 var idx = _tableAPI.cell( this ).index().column;
    //     //                 var title = _tableAPI.columns( idx ).header();
                     
    //     //                 alert( 'Column title clicked on: '+($(title).width()+36) );
    //     //             } );
                    

    //         var column_0 = grid.DataTableAPI.column(0);
    //         var column_3 = grid.DataTableAPI.column(3);
    //         var column_4 = grid.DataTableAPI.column(4);
    //         var column_5 = grid.DataTableAPI.column(5);
    //         var column_6 = grid.DataTableAPI.column(6);
    //     	if (width <= 600){
    //             column_0.visible(true);
    //             column_3.visible(false);
    //             column_4.visible(false);
    //             column_5.visible(false);
                
    //             column_6.visible(false);
    //     	} else if (width > 600){
    //     	    column_0.visible(false);
        	    
    //             column_3.visible(true);
    //             column_4.visible(true);
    //             column_5.visible(true);
                
    //             column_6.visible(true);
    //     	}
    // 	},
        render:function(){
    	   var that = this;
    	   this.options.collection.fetch({
    	       success: function(){
    	           that.renderTable();
    	       }
    	   });
    	   
    	   return this;
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
    	   // if (_.isUndefined(item)){
        //         this.DataTableAPI.row('.selected').remove().draw( false );
    	   // } else {
    	   //     var inde=this.DataTableAPI.fnFindCellRowIndexes( item);
    	   // }
    	},
    	
    	addRow:function(model){//add row
    	    this.DataTableAPI.row.add(model).draw();
    	},
    	
    	renderTable:function(){
    	    var _grid = this;
    	    
    	    if($.fn.DataTable.isDataTable($("#"+this.options.el).find("#"+this.options.id))){
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
    	    
    	    $("#"+this.options.el).append(GridHTML);
    	    var _dataTable = $("#"+this.options.el).find("table")
    	    _dataTable.attr("id", this.options.id);
    	    
            _dataTable.dataTable({
                "lengthChange": false,
                "searching": false,
     	        "data" : this.options.collection.toJSON(),
     	        "columns" : _columns
     	    });
     	    
     	    $("#"+this.options.id).find("tbody").on( 'click', 'tr', function () {
                if ( $(this).hasClass('selected') ) {
                    $(this).removeClass('selected');
                }
                else {
                    _dataTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            } );
            
            var _tableAPI=_dataTable.dataTable().api();
            
            if(this.options.detail){
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
                        row.child( _grid.format(row.data()) ).show();
                        tr.addClass('shown');
                    }
                });
            }
            this.DataTableAPI=_tableAPI;
    	},
    	
    	format : function ( d ) {
            // `d` is the original data object for the row
            return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
                '<tr>'+
                    '<td>Full name:</td>'+
                    '<td>'+d.name+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Extension number:</td>'+
                    '<td>'+d.extn+'</td>'+
                '</tr>'+
                '<tr>'+
                    '<td>Extra info:</td>'+
                    '<td>And any further details here (images etc)...</td>'+
                '</tr>'+
            '</table>';
        },
    	
    });
    return Grid;
});