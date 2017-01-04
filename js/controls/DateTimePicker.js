/**
 * @class A Bootstrap DateTimePicker Control
 * http://tarruda.github.com/bootstrap-datetimepicker/
 * @constructs optier.control.DateTimePicker
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.DateTimePicker = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value;
}; 

jQuery.extend( optier.control.DateTimePicker.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.DateTimePicker
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);

		var thi$ = this;

		thi$.control = thi$.element.datetimepicker().data('datetimepicker');
		thi$.control.format = oLocal.getDateTimeShortFormat();
		thi$.control.setLocalDate( new Date(thi$.value) );

		//bind to the changing of the date value
		thi$.element.on('changeDate', function(e) {
			thi$.setValue( thi$.control.getLocalDate().valueOf() );
			//console.log("time: " + new Date(thi$.value) );
		});
	},
	disable : function(){
		$("#" + this.containerID + " *").attr('disabled', 'disabled');
		$("#" + this.containerID + " *").on('click', function(e){
			e.stopImmediatePropagation();
			e.preventDefault();
		});
	}

});
/*#@-*/