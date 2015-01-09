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
    	    var grid=this;
    	    $(window).on("resize", function(){
    	        grid.updateCSS(grid);     
    	    });
            this.options=options;
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'getSelectItem');
    		_.bindAll(this, 'removeRow');
    		
    		this.render();
    	},
    	updateCSS:function(grid){
    	    var width=$(window).width();
    	    var API=grid.DataTableAPI;
    	    LOG.debug(width);
    	   // $("#"+grid.options.el+" tbody").on( 'click', 'td', function () {
        //                 var idx = _tableAPI.cell( this ).index().column;
        //                 var title = _tableAPI.columns( idx ).header();
                     
        //                 alert( 'Column title clicked on: '+($(title).width()+36) );
        //             } );
                    

            var column_0 = grid.DataTableAPI.column(0);
            var column_3 = grid.DataTableAPI.column(3);
            var column_4 = grid.DataTableAPI.column(4);
            var column_5 = grid.DataTableAPI.column(5);
            var column_6 = grid.DataTableAPI.column(6);
        	if (width <= 600){
                column_0.visible(true);
                column_3.visible(false);
                column_4.visible(false);
                column_5.visible(false);
                
                column_6.visible(false);
        	} else if (width > 600){
        	    column_0.visible(false);
        	    
                column_3.visible(true);
                column_4.visible(true);
                column_5.visible(true);
                
                column_6.visible(true);
        	}
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
    	render:function(){
    	    var grid=this;
    	    var _columns=[],_column;
    	    _column=this.options.column;
    	    _columns.push({
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            });
            var pushData=[];
            _.map(grid.options.dataschema,function(value, key){
                pushData.push(value);
            });
    	    for (var i=0; i < _column.length; i++){// 컬럼 만들기.
    	        _columns.push({ "title":_column[i], "data" : pushData[i] });
    	    }
    	    
    	    var _dataTable=$(GridHTML);
     	    var _collection= this.options.collection;
             	    
             	    
     	    _collection.fetch({
    		    success : function(data){
    		        var dataArr = [];
                    $.each(_collection.toJSON(), function(i, obj) {
                        var pushData={};
                        _.map(grid.options.dataschema,function(value, key){
                            pushData[value]=(obj[value]);
                        });
                        dataArr.push(pushData);
                    });
                    
                    _dataTable.dataTable({
                        "lengthChange": false,
                        "searching": false,
             	        "data" : dataArr,
             	        "columns" : _columns
             	    })
             	    
             	    var _tableAPI=_dataTable.dataTable().api();
             	    
             	    $("#"+grid.options.el).find("tbody").on( 'click', 'tr', function () {
                        if ( $(this).hasClass('selected') ) {
                            $(this).removeClass('selected');
                        }
                        else {
                            _dataTable.$('tr.selected').removeClass('selected');
                            $(this).addClass('selected');
                        }
                    } );
                    function format ( d ) {
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
}


                    
                    $("#"+grid.options.el+" tbody").on('click', 'td.details-control', function () {
                        var tr = $(this).closest('tr');
                        var row = _tableAPI.row( tr );
                 
                        if ( row.child.isShown() ) {
                            // This row is already open - close it
                            row.child.hide();
                            tr.removeClass('shown');
                        }
                        else {
                            // Open this row
                            row.child( format(row.data()) ).show();
                            tr.addClass('shown');
                        }
                    });
                    //  var lastIdx = null;
                    // $("#"+grid.options.el+" tbody").on( 'mouseover', 'td', function () {
                    //     var colIdx = _tableAPI.cell(this).index().column;
                    //     if ( colIdx !== lastIdx ) {
                    //         $( _tableAPI.cells().nodes() ).removeClass( 'highlight' );
                    //         $( _tableAPI.column( colIdx ).nodes() ).addClass( 'highlight' );
                    //     }
                    // } )
                    // .on( 'mouseleave', function () {
                    //     $( _tableAPI.cells().nodes() ).removeClass( 'highlight' );
                    // } );
                    
                    
                    grid.DataTableAPI=_tableAPI;
                    // $('#button').click( function () {
                    //     _dataTable.row('.selected').remove().draw( false );
                    // } );
                    
                    
    	            grid.updateCSS(grid);     
    		    }   
    		});
    		$("#"+this.options.el).append(_dataTable);
     	}
    });
    return Grid;
});