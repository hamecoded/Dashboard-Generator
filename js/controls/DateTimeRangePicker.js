/**
 * @class A Bootstrap DateTimeRangePicker Control
 * @constructs optier.control.DateTimeRangePicker
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.DateTimeRangePicker = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value;
}; 

jQuery.extend( optier.control.DateTimeRangePicker.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.DateTimeRangePicker
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);

		var thi$ = this;
		thi$.control = [
			thi$.element.find(".start").datetimepicker().data('datetimepicker'),
			thi$.element.find(".end").datetimepicker().data('datetimepicker')
		];

		thi$.control[0].format = oLocal.getDateTimeShortFormat();
		thi$.control[1].format = oLocal.getDateTimeShortFormat();
		
		if( !(thi$.isValidData()) ){
			var err = "Initial server values for DateRange do not compute:<br>" +
					   "min: " + thi$.model.min + "<br>" + 
					   "start: " + thi$.value[0] + "<br>" + 
					   "end: " + thi$.value[1] + "<br>" + 
					   "max: " + thi$.model.max;
			oLogger.popError(err);
		}
		
		thi$.control[0].setLocalDate( new Date(thi$.value[0]) );
		thi$.control[1].setLocalDate( new Date(thi$.value[1]) );

		//bind to the changing of the date value
		thi$.element.find(".start").on('changeDate', function(e) {
			var err;
			//var start = e.date.valueOf();
			var start = thi$.control[0].getLocalDate().valueOf();
			var end = thi$.value[1];
			if( start > end ){
				err = "The start time exceeds the end time.<br> Action reverted!";
			}else if(thi$.model.min && start < thi$.model.min){
				err = "The start time is earlier than the minimum allowed.<br> Action reverted!";
			}else{
				thi$.setValue([ start ,  end] );								
			}
			if(err){
				oLogger.popError(err);
				thi$.control[0].setLocalDate( new Date( thi$.value[0] ) );	
			}
			//console.log("*start: " + new Date(start) + "  :  end: " + new Date(end) );
		});
		thi$.element.find(".end").on('changeDate', function(e) {
			var err;
			var start = thi$.value[0];
			var end = thi$.control[1].getLocalDate().valueOf();
			if( start > end){
				err = "The end time preceeds the start time.<br> Action reverted!";
			}else if(thi$.model.max && end > thi$.model.max){
				err = "The end time is later than the maximum allowed.<br> Action reverted!";
			}else{
				thi$.setValue([ start ,  end] );								
			}
			if(err){
				oLogger.popError(err);
				thi$.control[1].setLocalDate( new Date( thi$.value[1] ) );		
			}
			//console.log("start: " + new Date(start) + "  :  *end: " + new Date(end) );
		});
	},
	applyValue : function(start, end){
		this.value = [start , end];
		this.control[0].setLocalDate( new Date( start ) );	
		this.control[1].setLocalDate( new Date( end ) );	
	},
	applyStart : function(value){
		this.value[0] = value;
		this.control[0].setLocalDate( new Date( value ) );	
	},
	applyEnd : function(value){
		this.value[1] = value;
		this.control[1].setLocalDate( new Date( value ) );	
	},
	isValidData : function(){
		return (this.model.min || 0) < this.value[0] &&
				this.value[0] < this.value[1] &&
				this.value[1] < (this.model.max || 9999999999999);
	}

});
/*#@-*/