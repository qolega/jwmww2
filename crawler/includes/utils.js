var utils = (function() {

    function select(selector) {
        if (!selector) {
            return null;
        }
        
        var selected = document.querySelector(selector);
        if (!selected) {
            throw 'getAttribBySelector: no item matching selector ' + selector;
        }
        
        return selected;
    }

    return {
        getDropDownSeleced: function(selector) {
            var dropDown = select(selector);
            if (dropDown) {
                var selected = dropDown.querySelector('option[selected="selected"]');
                if (selected) {
                    return selected.innerHTML
                }
            }
            
            return null;
        },
        getAttribBySelector: function(selector, attrib) {
            
            var selected = select(selector);
            
            if (attrib) {
                if (selected.hasAttribute(attrib)) {
                    return selected.getAttribute(attrib);
                } 
                else {
                    return null;
                }
            } else {
                return selected.innerHTML;
            }
        },
        getAttribsBySelector: function(selector, attrib) {
            
            var selected = document.querySelectorAll(selector);
            //console.log('getAttribsBySelector: items selected - ' + selected.length);
            
            if (attrib) {
                return Array.prototype.map.call(selected, function(e) {
                    return e.getAttribute(attrib);
                });   
            } else {
                var array = Array.prototype.map.call(selected, function(e) {
                    //console.log('getAttribsBySelector: innerHTML - ' + e.innerHTML);
                    return e.innerHTML;
                }); 
                
                //console.log('getAttribsBySelector: returning elements - ' + array.length);
                
                return array;
            }
        },
        getIsCheckedBySelector: function(selector) {
            var checked = this.getAttribBySelector(selector, 'checked');
            if (checked === 'checked') {
                return true;
            } else {
                return false;
            }
        },
        getDateByIdPostfix: function(idPostfix) {
            var yearOf = this.getDropDownSeleced('select[id$="ddlYearOf' + idPostfix + '"]');
            var monthOf = this.getDropDownSeleced('select[id$="ddlMonthOf' + idPostfix + '"]');
            var dayOf = this.getDropDownSeleced('select[id$="ddlDayOf' + idPostfix + '"]');
            return new Date(yearOf, monthOf, dayOf);
        }
    }   
}());

// function export for casper
exports.getAttribsBySelector = utils.getAttribsBySelector;    

