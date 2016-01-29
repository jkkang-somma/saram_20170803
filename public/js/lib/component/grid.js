// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'util',
  'log',
  'schemas',
  'dialog',
  'models/sm/SessionModel',
  'datatables',
  'util',
  'text!templates/default/button.html',
  //'fnFindCellRowIndexes',
  'text!templates/component/grid.html',
  'lib/FileSaver',
  ], function($, _, Backbone, Util, log, Schemas, Dialog, SessionModel, Datatables, Util, ButtonHTML, GridHTML, fileSaver){
    var LOG=log.getLogger('Grid');
    var gridId=0;
    var _glyphiconSchema=Schemas.getSchema('glyphicon');
    var _defaultGroupBtnTag='<span class="input-group-btn"></span>';
    var _defaultBtnTag='<button class="btn btn-default btn-sm btn-success grid-btn" type="button" data-toggle="tooltip" data-original-title="<%= obj.tooltip %>"></button>';
    var _defaultBtnText='<span style="display: table-row;"></span>';
    
    var _gridLength=[10,25,50,100];
    
    var Grid = Backbone.View.extend({
    	initialize:function(options){
    	    var grid=this;
    	    
    	    
    	    var lastWidth = $(window).width();
    	    $(window).on("resize", function(e){
    	        if($(window).width()!=lastWidth){
    	            LOG.debug(lastWidth);
    	            LOG.debug($(window).width());
    	            grid.updateCSS(grid);     
                }
    	    });
    	    
            this.options=options;
            this.buttonid=[];
            this.filterValue={
                meRecord:0
            };
            this.filters={};
            
            var _btns=this.options.buttons;
            if (_.isUndefined(_btns) || _.isNull(_btns) || _btns.length <= 0){
                _btns=["search"];
                LOG.debug(_btns);
                this.options.buttons=_btns;    
            }
            this.options.format=this.format;
            this.currentLength=50;
            
            if (_.isUndefined(this.options.id) || _.isNull(this.options.id)){
                this.options.id = "grid-"+(gridId++);
            }
            
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'getSelectItem');
    	    _.bindAll(this, 'updateRow');
    		_.bindAll(this, 'removeRow');
    		_.bindAll(this, 'search');
    		_.bindAll(this, 'filtering');
    		_.bindAll(this, 'setBtnText');
    		this.render();
    	},
    	setBtnText:function(btn, text){
    	    btn.html($(_defaultBtnText).html(text));
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
                    if(index === "0"){
                        column.visible(this.options.visibleSub);
                    }else{    
                        column.visible(_.isUndefined(this.columns[index].visible) ? true : this.columns[index].visible);
                    }
                }
            } else if ( width  < 767) {
                
                // API.column(index).visible(true);
                 for (var index in _columns){
                    column=API.column(index);
                    var header=column.header(index);
                    
                    if(index === "0"){
                        column.visible(true);
                        _cTotallWidth = _cTotallWidth+ header.offsetWidth;
                        continue;
                    }
                    
                    var _cWidth = header.offsetWidth;
                    _cTotallWidth=_cTotallWidth+_cWidth;
                    
                    var colVisible = _.isUndefined(this.columns[index].visible) ? true : this.columns[index].visible;
                    if (width > _cTotallWidth+_padding && colVisible){
                        column.visible(true);
                    } else {
                        column.visible(false);
                    }
                }
            }
    	},
    	format : function (rowData) {
    	    var _result=$('<div></div>');
    	    var _subTable=$('<table class="subTable" cellpadding="5" cellspacing="0" border="0" ></table>');
    	    
    	    
    	    for(var idx in this.column){
    	        var _column = this.column[idx];
    	        var _value;
    	        
    	        if (!(_column.subVisible==false) && !(_column.visible==false)){
        	        if(!_.isUndefined(_column.render)){
        	            if(!_.isUndefined(_column.data)){
        	                _value = _column.render(rowData[_column.data],{},rowData);
        	            }else{
        	                _value = _column.render({},{},rowData);
        	            }
        	        }else if(!_.isUndefined(_column.data)){
    	                _value = rowData[_column.data];
        	        }
        	        if(_.isNull(_value) || _value=="null")
                        _value ="";
                        
        	        _column = _column.title;
        	        _subTable.append(
        	            '<tr>'
        	                +'<td>'+_column+'</td>'
                            +'<td>'+_value+'</td>'
                        +'</tr>'
        	        );
    	        }
    	    }
    	    
    	    _result.append(_subTable);
    	    
            return _result.html();
    	   // for (var name in rowData){
    	        
    	        
    	      
    	       // var index=_.indexOf(this.dataschema, name);
    	       // if (-1 < index){
    	       //     var _column=this.column[index];
    	       //     var _value;
    	       //     if (_.isObject(_column)){
    	       //         if (!_.isUndefined(_column.render)){
    	       //             _value=_column.render({},{},rowData);
    	       //         } else {
    	       //             _value=rowData[name];
    	       //         }
    	       //         _column=_column.title;
    	       //     }   else {
	           //         _value=rowData[name];
	           //     }
	                
            //         if(_.isNull(_value) || _value=="null"){
            //             _value ="";
            //         }
    	            
    	            
    	       //     if ((_.isObject(this.column[index])&&this.column[index].subVisible==false)||_value==""){//sub detail visible
    	                
    	       //     } else {
        	   //         _subTable.append(
            // 	            '<tr>'
            // 	                +'<td>'+_column+'</td>'
            //                     +'<td>'+_value+'</td>'
            //                 +'</tr>'
            // 	        );
    	       //     }
    	       // }
    	        
    	   // }
    	    
        },
        getAllData:function(){
            return this.DataTableAPI.rows().data();
        },
        getRowByFunction:function(validateFunction){
            return this.DataTableAPI.row(validateFunction);
        },
    	getSelectItem:function(){//선택된 row 가져오기
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectItem=this.DataTableAPI.row('.selected').data();
    	    return selectItem;
    	},
    	getDataAt:function(idx){ // 데이터 배열에서 index 값으로 가져오기 
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectItem=this.DataTableAPI.row(idx).data();
    	    return selectItem;
    	},
    	getNodeAt:function(rowIndex, colIndex){
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectedNode=this.DataTableAPI.cell({row : rowIndex, column : colIndex}).node();
    	    return selectedNode;
    	},
    	getRowNodeAt:function(rowIdx){
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectedNode=this.DataTableAPI.row(rowIdx).node();
    	    return selectedNode;
    	},
    	getColumnNodeAt:function(colIdx){
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectedNode=this.DataTableAPI.row(colIdx).node();
    	    return selectedNode;
    	},
    	removeRow:function(item, index){//선택된 row 삭제 //default 선택된 아이템  index로 하려면. index 를 넣어주세요
    	    if (_.isUndefined(index)){
    	        this.DataTableAPI.row('.selected').remove().draw( false );
    	    } else if (_.isNumber(index)){
    	        this.DataTableAPI.row(index).remove().draw( false );
    	    }
    	},
    	addRow:function(item, index){//add row 
    	    this.DataTableAPI.row.add(item).draw();
    	},
    	updateRow:function(item, index){//default 선택된 아이템  index로 하려면. index 를 넣어주세요.
    	    if (_.isUndefined(index)){
    	        this.DataTableAPI.row('.selected').data(item);
    	    } else if (_.isNumber(index)){
    	        this.DataTableAPI.row(index).data(item);
    	    }
    	},
    	search:function(value, regex, smart){
    	    this.DataTableAPI.search(
                value,
                _.isUndefined(regex)?false:regex,
                _.isUndefined(smart)?false:smart
            ).draw();
            
            this._filtering();
    	},
    	filtering:function(filter, filterName){
    	    $.fn.dataTable.ext.search=[];
            this.filters[filterName]=filter;
            this._filtering();
    	},
    	_filtering:function(){
    	    
    	    var _filters=this.filters;
            $.fn.dataTable.ext.search=[];
            for (var name in _filters){
                $.fn.dataTable.ext.search.push(
                    function( settings, data, dataIndex ) {
                        var fn=_filters[name];
                        return fn(data);
                    }
                );
            }
            
            this.DataTableAPI.draw();
    	},
    	_crteateDefaultButton:function(id, name, clickEvent){
    	    var _buttonIcon=$(ButtonHTML);
    	    //_buttonIcon.attr("id", id);
            _buttonIcon.addClass(_glyphiconSchema.value(name));
            
            var _btnTmp=_.template(_defaultBtnTag);
            var _button=$(_btnTmp({tooltip:name}));//툴팁 셋팅
            
            _button.attr("id", id);
            _button.append(_buttonIcon);
            this._defatulInputGroup.append($(_defaultGroupBtnTag).append(_button));  
            
            if (!_.isUndefined(clickEvent) && _.isFunction(clickEvent)){
                _button.click(function(){
                   clickEvent(); 
                });
            }
            return _button;
    	},
    	_crteateCustomButton:function(obj){
    	    var _grid=this;
    	    
    	    var _buttonIcon;
    	    if (obj.name=="filter"){//필터 버튼일떄
    	        _buttonIcon=$(_defaultBtnText).html(obj.filterBtnText[0]);
    	    } else {//일반 아이콘
    	        _buttonIcon=$(ButtonHTML);
                _buttonIcon.addClass(_glyphiconSchema.value(obj.name));
    	    }
    	    
    	    var _btnId=this.options.id +"_custom_"+ obj.name +"_Btn";
            this.buttonid[obj.name] = _btnId;
            
            var _btnTmp=_.template(_defaultBtnTag);
            var _button=$(_btnTmp({tooltip:obj.tooltip}));
            
            _button.attr("id", _btnId);
            _button.append(_buttonIcon);
            this._defatulInputGroup.append($(_defaultGroupBtnTag).append(_button));
            _button.click(function(){
                if(_.isFunction(obj.click)){
                    var callback=obj.click;
                    callback(_grid, _button);
                }
            })
    	},
    	_createSearchButton:function(name){
    	    var _grid=this;
    	    
    	    
    	    var _defaultSearchInput=$('<input type="text" class="form-control" placeholder="Search">');
    	    _defaultSearchInput.addClass('yes-form-control');
    	    this._defatulInputGroup.append(_defaultSearchInput);
    	    this._defatulInputGroup.css({display:"table"});
    	    
    	    _defaultSearchInput.keydown(function(e){
    	        if(e.keyCode == 13){
    	            e.preventDefault();
    	            _grid.search(this.value,false,true);
    	            return false;
    	        }
    	    });
    	    
    	    var _buttonIcon=$(ButtonHTML);
            _buttonIcon.addClass(_glyphiconSchema.value("search"));
            
    	    var _btnTmp=_.template(_defaultBtnTag);
    	    
    	    var _btnId=this.options.id +"_"+ name +"_Btn";
    	    this.buttonid["search"] = _btnId;

    	    var _btn=$(_btnTmp({tooltip:"검색"}));//툴팁 셋팅
    	    _btn.attr("id", _btnId);
    	    _btn.append(_buttonIcon);
    	    this._defatulInputGroup.append($(_defaultGroupBtnTag).append(_btn));  
    	    
    	    _btn.click(function(){
                _grid.search(_defaultSearchInput.val(),false,true);      
            });
            
    	    var _rowNumBtnId=this.options.id +"_row_Btn";
    	    this.buttonid["row"] = _rowNumBtnId;
    	    
            var _rowButton=$(_btnTmp({tooltip:"표시수"}));//툴팁 셋팅
            
            _rowButton.attr("id", _rowNumBtnId);
            _rowButton.append($(_defaultBtnText).html( _grid.currentLength));
            this._defatulInputGroup.append($(_defaultGroupBtnTag).append(_rowButton));  
            _rowButton.click(function(){
                var index =_.indexOf(_gridLength, _grid.currentLength);
    	        if (index==3){
    	            index=0;
    	        } else {
    	            index++;
    	        }
    	        
    	        _grid.currentLength=_gridLength[index];
    	        _rowButton.html($(_defaultBtnText).html(_grid.currentLength));
    	        _grid.DataTableAPI.page.len( _grid.currentLength ).draw();
            });
    	},
    	_createRefreshButton:function(name){
    	    var _grid=this;
    	    var _btnId=this.options.id +"_"+ name +"_Btn";
    	    var _btn=this._crteateDefaultButton(_btnId, name);
    	    this.buttonid["refresh"] = _btnId;
    	     //refresh event
    	    _btn.click(function(){
                _grid.render();//ew.render();
            });
    	},
    	_createMyrecordButton:function(obj){
    	    var _grid=this;
    	    var filterBtnText=["나","전체"];
    	    var userName=SessionModel.getUserInfo().name;
    	    var userId=SessionModel.getUserInfo().id;
    	    var filter=[
    	        function(data){
    	            var filterColumns=obj.filterColumn;
    	            var configColumns=_grid.options.column;
    	            var configColumnsNameArr=_.pluck(configColumns, "data");
    	            
    	            for (var index in filterColumns){
    	                var columnName=filterColumns[index];
    	                var findIndex=_.indexOf(configColumnsNameArr, columnName)+1;
    	                
    	                var value=data[findIndex];
    	               // if (configColumns[_.indexOf(configColumnsNameArr, columnName)].render){
    	               //     value=data[findIndex];
    	               // } else {
    	               //     configColumns[_.indexOf(configColumnsNameArr, columnName)].render();
    	               // }
    	                
    	                var nameIndex=value.indexOf(userName);
    	                var idIndex=value.indexOf(userId);
    	                
    	                if (nameIndex>=0 || idIndex>=0){
    	                    return true;
    	                }
    	            }
    	            return false;
    	        },
    	        function(){
    	            return true;
    	        }
    	    ];
    	    var _buttonIcon;
    	    if(SessionModel.getUserInfo().id == "130702" || SessionModel.getUserInfo().dept_name == "임원"){
    	        _buttonIcon=$(_defaultBtnText).html(filterBtnText[1]);
    	    }else{
    	        _buttonIcon=$(_defaultBtnText).html(filterBtnText[0]);
    	    }
    	    
    	    
    	    var _btnId=this.options.id +"_custom_"+ obj.name +"_Btn";
            this.buttonid[obj.name] = _btnId;
            
            var _btnTmp=_.template(_defaultBtnTag);
            var _button=$(_btnTmp({tooltip:"검색 대상"}));
            
            _button.attr("id", _btnId);
            _button.append(_buttonIcon);
            this._defatulInputGroup.append($(_defaultGroupBtnTag).append(_button));
            
            //filter 설정
            if(SessionModel.getUserInfo().id == "130702" || SessionModel.getUserInfo().dept_name == "임원"){
                _grid.filterValue.myRecord=1;
                _grid.filters.myRecord=filter[1];
            }else{
                _grid.filterValue.myRecord=0;
                _grid.filters.myRecord=filter[0];
            }
            
            _button.click(function(){
                var index=_grid.filterValue.myRecord;
                if (index==(filterBtnText.length-1)){
                    index=0;
                } else {
                    index++;
                }
                _button.html($(_defaultBtnText).html(filterBtnText[index]));
                _grid.filterValue.myRecord=index;
               //grid.filtering(filter[index]);
                _grid.filters.myRecord=filter[index];
    	        _grid._filtering();
            })
    	},
        _createMyDeptRecordButton:function(obj){
            var _grid=this;
            var filterBtnText=["부서","전체"];
            var userDeptName=SessionModel.getUserInfo().dept_name;
            var filter=[
                function(data){
                    var filterColumns=obj.filterColumn;
                    var configColumns=_grid.options.column;
                    var configColumnsNameArr=_.pluck(configColumns, "data");
                    
                    for (var index in filterColumns){
                        var columnName=filterColumns[index];
                        var findIndex=_.indexOf(configColumnsNameArr, columnName)+1;
                        
                        var value=data[findIndex];
                       // if (configColumns[_.indexOf(configColumnsNameArr, columnName)].render){
                       //     value=data[findIndex];
                       // } else {
                       //     configColumns[_.indexOf(configColumnsNameArr, columnName)].render();
                       // }
                        
                        var nameIndex=value.indexOf(userDeptName);
                        
                        if (nameIndex>=0){
                            return true;
                        }
                    }
                    return false;
                },
                function(){
                    return true;
                }
            ];

            var _buttonIcon;
            if(SessionModel.getUserInfo().id == "130702" || SessionModel.getUserInfo().dept_name == "임원"){
                _buttonIcon=$(_defaultBtnText).html(filterBtnText[1]);
            }else{
                _buttonIcon=$(_defaultBtnText).html(filterBtnText[0]);
            }
            
            var _btnId=this.options.id +"_custom_"+ obj.name +"_Btn";
            this.buttonid[obj.name] = _btnId;
            
            var _btnTmp=_.template(_defaultBtnTag);
            var _button=$(_btnTmp({tooltip:"검색 대상"}));
            
            _button.attr("id", _btnId);
            _button.append(_buttonIcon);
            this._defatulInputGroup.append($(_defaultGroupBtnTag).append(_button));
            
            //filter 설정
            if(SessionModel.getUserInfo().id == "130702" || SessionModel.getUserInfo().dept_name == "임원"){
                _grid.filterValue.myRecord=1;
                _grid.filters.myRecord=filter[1];
            }else{
                _grid.filterValue.myRecord=0;
                _grid.filters.myRecord=filter[0];
            }
            
            _button.click(function(){
                var index=_grid.filterValue.myRecord;
                if (index==(filterBtnText.length-1)){
                    index=0;
                } else {
                    index++;
                }
                _button.html($(_defaultBtnText).html(filterBtnText[index]));
                _grid.filterValue.myRecord=index;
               //grid.filtering(filter[index]);
                _grid.filters.myRecord=filter[index];
                _grid._filtering();
            })
        },
    	_drawButtons:function(){//button draw
    	    var _grid=this;
    	    var _btns=this.options.buttons;
            
    	    //Button Group
    	    if($("#"+this.options.el).find(".input-group")){
    	        $("#"+this.options.el).find(".input-group").remove();
    	    }
    	    this._defatulInputGroup=$('<div class="input-group input-group-sm"></div>');
    	    
    	    for (var index in _btns){
    	        var obj = _btns[index];
    	        var name;
    	        if (_.isString(obj)){
    	            name=obj;
    	        } else if (_.isObject(obj)){
    	            if (_.isUndefined(obj.type) || _.isNull(obj.type) || _.isEmpty(obj.type)){
    	                continue;
    	            }
    	            
    	            name=obj.type;
    	        }
    	        switch (name) {
    	            case "search" :
                	    this._createSearchButton(name);
    	                break;
    	            case "custom" :
    	                this._crteateCustomButton(obj);
    	                break;
                    case "refresh" :
                        this._createRefreshButton(name);
                        break;
                    case "myRecord" :
                        this._createMyrecordButton(obj);
                        break;  
                    case "myDeptRecord" :
                        this._createMyDeptRecordButton(obj);
                        break;
    	        }
    	    }
            
    	    $("#"+this.options.el).append(this._defatulInputGroup);
    	},
    	_draw:function(){
    	    var _grid = this;
    		//필터링 초기화
            $.fn.dataTable.ext.search=[];
            if(SessionModel.getUserInfo().id == "130702"){
    	        _grid.currentLength=100;   
    	    }else{
                _grid.currentLength=50;
    	    }
            
    	    this._drawButtons();
    	
    	    if($.fn.DataTable.isDataTable($("#"+this.options.el).find("#"+this.options.id))){//
    	        $("#"+this.options.el).find("#"+this.options.id).parent().remove();
    	    }
    	    
    	    var _columns=[];
    	    if(this.options.detail){
                _columns.push({
                    "className":      'details-control',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": '',
                });
    	    }
            
    	    for (var i=0; i < this.options.column.length; i++){// 컬럼 만들기.
    	        var _column=this.options.column[i];
    	        if (_.isObject(_column)){
    	            _columns.push(_column);
    	        } else {
    	            _columns.push({ "title":this.options.column[i], "data" : this.options.dataschema[i] });
    	        }
    	    }
    	    
    	    this.columns= _columns;
    	    this.options.collection.toJSON();
    	    //dataTable reander
    	    var _dataTable=$(GridHTML);
            $("#"+this.options.el).append(_dataTable);
    	    _dataTable.attr("id", this.options.id);
            _dataTable.dataTable({
                "lengthChange": false,
                "sDom": '<"top">rt<"bottom"ip>',// _dataTable display controll
     	        "data" : this.options.collection.toJSON(),
     	        "columns" : _columns,
     	        "rowCallback" : _.isUndefined(this.options.rowCallback) ? null : this.options.rowCallback,
     	        "order" : _.isUndefined(this.options.order) ? [[1, "desc"]] : this.options.order
     	    });
     	    
     	    //ROW click
     	    _dataTable.find("tbody").on( 'click', '.odd, .even', function () {
                _dataTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
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
            this.DataTableAPI=_tableAPI;//API 셋팅
    	    _grid.DataTableAPI.page.len( _grid.currentLength ); //page length 설정
    	    $("#"+this.options.el).find('[data-toggle="tooltip"]').tooltip({
                placement : 'top'
            });
    	    
    	    _grid._filtering();
            this.updateCSS();
        },
    	getButton: function(name){
    	    return this.buttonid[name];
    	    
    	},
    	render:function(){
    	   var grid = this;
    	   
    	   if(Util.isNull(this.options.fetch) || this.options.fetch === true){
    	       var _defaultFetchParams={
        	       success: function(){
        	           grid._draw();
        	       }
        	   };
    	       if (!_.isUndefined(this.options.fetchParam)){
    	           _defaultFetchParams=_.extend(_defaultFetchParams, this.options.fetchParam);
    	       }
        	   this.options.collection.fetch(_defaultFetchParams);    
    	   }else{
    	       grid._draw();
    	   }
    	   return grid;
     	},
        saveExcel:function(){
            
            var grid = this;
            var gridAllData = grid.getAllData();

            var gridHtml = '<table>';
            //TITLE
            gridHtml = gridHtml.concat('<thead><tr>');
            for ( var i=1 ; i < grid.columns.length ; i++ ) {
                gridHtml = gridHtml.concat('<th>');
                gridHtml = gridHtml.concat(grid.columns[i].title);
                gridHtml = gridHtml.concat('</th>');
            }
            gridHtml = gridHtml.concat('</tr></thead>');

            // BODY
            gridHtml.concat('<tbody>');
            for ( var i=0 ; i < gridAllData.length ; i++ ) {
                var rowData = grid.getRowNodeAt(i);
                gridHtml = gridHtml.concat(rowData.outerHTML);
            }
            gridHtml = gridHtml.concat('</tbody>');
            gridHtml = gridHtml.concat('</table>');

            gridHtml = gridHtml.replace(/<br>/g, ' ');
            
            var d = new Date();
            var dateStr = Util.dateToString(d);
            dateStr = dateStr.concat('_');
            dateStr = dateStr.concat(Util.timeToString(d));

            // 방식_1
            // var link = document.createElement('a');
            // document.body.appendChild(link);
            // var data_type = 'data:application/vnd.ms-excel';
            // link.download = "GridDataExcel.xls";
            
            // link.href = data_type + ', ' + gridHtml;
            // link.click();

            // 방식_2
            // $('#grid-0').battatech_excelexport({
            //     containerid : "grid-0",
            //     datatype: 'table'
            // });

            // 방식_3
            saveAs(new Blob(["\uFEFF" + gridHtml], {type: "text/csv;charset=utf-8"}), 'GridDataExcel_' + dateStr + '.xls');
            
        }
    });
    return Grid;
});