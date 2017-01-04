/**
 * @class A Bootstrap DateRangePicker Control
 * http://www.dangrossman.info/2012/08/20/a-date-range-picker-for-twitter-bootstrap/
 * @constructs optier.control.DateRangePicker
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.DateRangePicker = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value;
}; 

jQuery.extend( optier.control.DateRangePicker.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.DateRangePicker
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);

		var thi$ = this;

		thi$.control = thi$.element.daterangepicker(
 			{
		        ranges: {
		            'Today': ['today', 'today'],
		            'Yesterday': ['yesterday', 'yesterday'],
		            'Last 7 Days': [Date.today().add({ days: -6 }), 'today'],
		            'Last 30 Days': [Date.today().add({ days: -29 }), 'today'],
		            'This Month': [Date.today().moveToFirstDayOfMonth(), Date.today().moveToLastDayOfMonth()],
		            'Last Month': [Date.today().moveToFirstDayOfMonth().add({ months: -1 }), Date.today().moveToFirstDayOfMonth().add({ days: -1 })]
		        }
		    },
		    function(start, end) {
		    	thi$.setValue(start , end);		        
		    }
		);

		thi$.element.val(  oLocal.toDateFormat(thi$.value[0]) + 
							' - ' + 
							oLocal.toDateFormat(thi$.value[1]) );
	},
	disable : function(){
		$("#" + this.containerID + " *").attr('disabled', 'disabled');
		$("#" + this.containerID + " *").on('click', function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
		});
	},
	setValue : function(start, end){
		var value = arguments.length == 1 ? start : [start.valueOf() , end.valueOf()];
		if(this.element){
			this.element.val(	oLocal.toDateFormat(value[0]) + 
								' - ' +
								oLocal.toDateFormat(value[1]) );
		}
		optier.control.BaseControl.prototype.setValue.call(this, value );
	}

});
/*#@-*/