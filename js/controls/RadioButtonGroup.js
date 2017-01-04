/**
 * @class A Bootstrap RadioButtonGroup Control
 * http://www.eyecon.ro/bootstrap-RadioButtonGroup/
 * @constructs optier.control.RadioButtonGroup
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.RadioButtonGroup = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value;
}; 

jQuery.extend( optier.control.RadioButtonGroup.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.RadioButtonGroup
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);

		this.value = this.element.find("input:checked").val();
	},
	_bind : function(){
		var thi$ = this;	
		thi$.element.find("input").on('change', function(e) {
			thi$.setValue($(e.target).val());
		});	
	}

});
/*#@-*/