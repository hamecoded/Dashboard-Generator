/**
 * @class A Bootstrap ButtonDropDown Control
 * http://caseyjhol.github.com/bootstrap-select/
 * @constructs optier.control.ButtonDropDown
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.ButtonDropDown = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value;
}; 

jQuery.extend( optier.control.ButtonDropDown.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.ButtonDropDown
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);
		this.element.selectpicker();
	}

});
/*#@-*/
