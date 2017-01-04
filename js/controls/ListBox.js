/**
 * @class A Bootstrap ListBox Control
 * http://www.eyecon.ro/bootstrap-ListBox/
 * @constructs optier.control.ListBox
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.ListBox = function(model) {
	optier.control.BaseControl.call(this, model);
	this.value = this.model.value;
}; 

jQuery.extend( optier.control.ListBox.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.ListBox
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);
	},
	_bind : function(){
		var thi$ = this;	
		thi$.element.on('change', function(e) {
			var value = $(this).val();
			switch(thi$.model.type){
				case "Duration":
					value = { "amount" : parseInt(value) };
					break;
			}
			thi$.setValue(value);
			oPoller.send(thi$);
		});	
	},
	applyValue : function(value){
		var thi$ = this;
		if(value){
			$(value).each(function(i, option){
				if(option.id){
					var existingOption = thi$.element.find("option[value=" + option.id + "]");
					if( existingOption.length == 0 ){
						thi$.element.append("<option value=" + option.id + ">" + option.value + "<option>");
					}else{
						existingOption.text(option.value);
					}
				}
			});
		}else{
			//reset
			thi$.element.html("");
		}
	}

});
/*#@-*/