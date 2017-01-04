/**
 * @class A Bootstrap ColorPicker Control
 * http://www.eyecon.ro/bootstrap-colorpicker/
 * @constructs optier.control.ColorPicker
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.ColorPicker = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value;
}; 

jQuery.extend( optier.control.ColorPicker.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.ColorPicker
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);

		var thi$ = this;

		thi$.control = thi$.element.colorpicker({
			format: 'hex'
		});

		//bind to the changing of the color value
		thi$.element.on('changeColor', function(e) {
			thi$.setValue(e.color.toHex());
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