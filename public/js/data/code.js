define([
    'jquery',
	'underscore',
	'collection/code/DepartmentCodeCollection',
    'collection/code/OfficeCodeCollection',
    'collection/code/OvertimeCodeCollection',
    'collection/code/WorkTypeCodeCollection',
], function($, _,
DepartmentCodeCollection, OfficeCodeCollection, OvertimeCodeCollection, WorkTypeCodeCollection){
    var Code = {
        DEPARTMENT : "DEPARTMENT",
        OFFICE : "OFFICE",
        OVERTIME : "OVERTIME",
        WORKTYPE : "WORKTYPE",
        
        departmentCollection : new DepartmentCodeCollection(),
        officeCollection : new OfficeCodeCollection(),
        overtimeCollection : new OvertimeCodeCollection(),
        worktypeCollection : new WorkTypeCodeCollection(),
        
        init : function(){
            var dfd = new $.Deferred();
            $.when(
                this.departmentCollection.fetch(),
                this.officeCollection.fetch(),
                this.overtimeCollection.fetch(),
                this.worktypeCollection.fetch()
            ).done(function(){
                dfd.resolve();
            }).fail(function(){
                dfd.reject();
            })
            return dfd.promise();
        },
        _getCollection : function(kind){
            var destCollection = null;
            switch(kind){
                case this.DEPARTMENT:
                    destCollection =this.departmentCollection;
                    break;
                case this.OFFICE:
                    destCollection =this.officeCollection;
                    break;
                case this.OVERTIME:
                    destCollection =this.overtimeCollection;
                    break;
                case this.WORKTYPE:
                    destCollection =this.worktypeCollection;
                    break;
            }
            return destCollection;
        },
        getCodeName : function(kind, code){
            var destCollection = this._getCollection(kind);
            if(_.isNull(destCollection)){
                return null;
            }
            var result = destCollection.where({code : code});
            
            if(result.length > 0){
                return result[0].get("name");      
            }else{
                return null;
            }
        },
        getCodes : function(kind){
            var destCollection = this._getCollection(kind);
            if(_.isNull(destCollection)){
                return null;
            }
            return destCollection.toJSON();
        }
    }
	return Code;

});



