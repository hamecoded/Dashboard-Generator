/**
 * @class A Bootstrap CheckBox Control
 * http://www.eyecon.ro/bootstrap-CheckBox/
 * @constructs optier.control.CheckBox
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.CheckBox = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value;
}; 

jQuery.extend( optier.control.CheckBox.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.CheckBox
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);
	},
	_bind : function(){
		var thi$ = this;	
		thi$.element.click( function(e) {
			thi$.setValue(this.checked);
			oPoller.send(thi$);
		});	
	}

});
/*#@-*/