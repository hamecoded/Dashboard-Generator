//
/**
 * @class A Bootstrap ColorIndicator Control
 * @constructs optier.control.ColorIndicator
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.ColorIndicator = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value; 
	this.config = {};
}; 

jQuery.extend( optier.control.ColorIndicator.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.ColorIndicator
	 */
	init : function(){
		var thi$ = this;
		optier.control.BaseControl.prototype.init.call(this);	
		switch(thi$.model.dataType){
			case "String":
				thi$.config.colors = ["green", "yellow", "red"];
				thi$.config[thi$.model.greenText.toLowerCase()] = "green";
				thi$.config[thi$.model.yellowText.toLowerCase()] = "yellow";
				thi$.config[thi$.model.redText.toLowerCase()] = "red";
				break;	
			case "WholeNumber":
			case "DecimalNumber":
			case "Duration":
				thi$.config.rangeDividers = [thi$.model.lowDivider,thi$.model.highDivider];
				if (thi$.model.isReversed) {
					thi$.config.colors = ["red", "yellow", "green"];
				} else {
					thi$.config.colors = ["green", "yellow", "red"];
				}
				break;
		} 
		
		thi$.applyValue(thi$.model.value);	
	},
	/**
	 * [applyValue description]
	 * @param  {[type]} data "OK";12
	 * @return {[type]}      [description]
	 */
	applyValue : function(data) {
		var thi$ = this;
		thi$.value = data;

		//remove current color
		for (var key in thi$.config.colors) {
			$(thi$.element).removeClass("ci-" + thi$.config.colors[key.toLowerCase()]);
		}

		//undefined value
		if (data == undefined || data == null) {
			return;
		}

		//adjust correct color
		switch(thi$.model.dataType){
			case "String":
				$(thi$.element).addClass("ci-" + thi$.config[thi$.value.toLowerCase()]);			
				break;	
			case "Duration":
				thi$.value = data.amount;
			case "WholeNumber":
			case "DecimalNumber":
			
				var color = thi$.config.colors[0];
				for(var index in thi$.config.rangeDividers){
					if(thi$.value >= thi$.config.rangeDividers[index]) {
						color = thi$.config.colors[Number(index)+Number(1)];
					} else {
						break;
					}	
				}
				$(thi$.element).addClass("ci-" + color.toLowerCase());			
				break;
		} 
		//todo: reset operation
		
	}
});
/*#@-*/