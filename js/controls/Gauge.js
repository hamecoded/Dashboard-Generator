//
/**
 * @class A Bootstrap Gauge Control
 * http://dojotoolkit.org/reference-guide/1.8/dojox/gauges/GlossyCircularGauge.html
 * http://dojotoolkit.org/reference-guide/1.8/dojox/dgauges.html#dojox-dgauges
 * http://build.dojotoolkit.org/
 * @constructs optier.control.Gauge
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.Gauge = function(model) {
	optier.control.BaseControl.call(this, model);

	this.value = this.model.value; 
	this.isCircular = true; //helper var for additional indicators class
	this.offset = 0; //helper var for additional indicators drawing
}; 

jQuery.extend( optier.control.Gauge.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.Gauge
	 */
	init : function(){
		var thi$ = this;
		optier.control.BaseControl.prototype.init.call(this);	
		
		switch(thi$.model.gaugeType){
			case "Circular":
				thi$.isCircular = true;
				thi$.createGauge("CircularLinearGauge");
				break;			
			case "SemiCircular":
				thi$.isCircular = true;
				thi$.createGauge("SemiCircularLinearGauge");
				break;			
			case "Horizontal":
				thi$.isCircular = false;
				thi$.createGauge("HorizontalLinearGauge");
				break;
			case "Vertical":
				thi$.isCircular = false;
				thi$.offset = -50;
				thi$.createGauge("VerticalLinearGauge");
				break;	 
		} 
	},
	createGauge : function(type){
		var thi$ = this;
		var ticker = (parseInt(thi$.model.minValue) || 0) + (parseInt(thi$.model.maxValue) || 100);
		var min = parseInt(thi$.model.minValue) || 0;
		var max = parseInt(thi$.model.maxValue) || 100;

		var makeGauge = function() {
			var style = thi$.model.gaugeStyle.toLowerCase();
			dojo.require('dojox.dgauges.components.' + style + '.' + type);
			var gauge = new dojox.dgauges.components[style][type]({
					interactionArea: 'none',
		            minimum: min,
		            maximum: max,
			        noChange :  thi$.model.disabled,
			        value: thi$.value,
			        id: thi$.containerID,
			        majorTickInterval : ticker/10,
			        animationDuration: 500,
			        width: thi$.element.parent().width(),
			        height: thi$.element.parent().height()
			    }, dojo.byId(thi$.containerID));
			
			// scale label function
			gauge.getElement("scale").tickLabelFunc = function(tickItem) { 
					if(tickItem.isMinor){
						return null;
					}else{
						switch (thi$.model.itemValueType) {
							case "DecimalNumber":
								return String(parseFloat(tickItem.value).toFixed(2));
								break; 
							case "WholeNumber":
								return String(Math.round(tickItem.value));
								break; 
							case "Duration":
								return miliSecondsToString(tickItem.value, true);
								break; 
						}
					}
				}

			// gauge.getElement("scale").labelPosition = "outside";

			//fix font size for decimal
			// if (thi$.model.itemValueType == "DecimalNumber" && style == "grey") {
			// 	gauge.getElement("scale").font = {
			//       size: "6pt",
			//     };
			// }
			
			
			   
			//additional indicators handling
			var indicators = thi$.getAdditionalIndicators();
			var indicatorClz = thi$.isCircular ? "CircularValueIndicator" : "RectangularValueIndicator";
			dojo.require("dojox.dgauges." + indicatorClz);

		    var length = 50;

		    for (var currIndicator in indicators) {
		    	var newIndicator = new dojox.dgauges[indicatorClz]({
					interactionArea: 'none',
					id: currIndicator,
					value: thi$.value,
					color: indicators[currIndicator],
					indicatorShapeFunc: function(group) {
						if (thi$.isCircular) {
							return group.createPolyline([thi$.offset,0,thi$.offset+length,0,thi$.offset,0,thi$.offset,0]).setStroke({color: this.color, width: 2});	
						} else {
							return group.createPolyline([-5,thi$.offset+10,5,thi$.offset+10,0,thi$.offset+20,-5,thi$.offset+10]).setFill(this.color);	
						}
					}
				});
		    	gauge.getElement("scale").addIndicator(currIndicator, newIndicator);
		    }
			
			gauge.startup();

			$(window).resize(function(event){
				thi$.resizeGauge();
			});
			thi$.control = gauge;
			thi$.resizeGauge();
		}
		
		dojo.ready( makeGauge );
	},
	getValueType : function(){
		switch(this.model.itemValueType){
			case "WholeNumber":
				return 0;
			case "DecimalNumber":
				return 2;
			case "Duration":
				return 1;
			default:
				return 0;
		}
	},
	getAdditionalIndicators : function(){
		return this.model.additionalIndicators;
	},
	applyValue : function(data) {
		var thi$ = this;
		this.value = data;
		
		//reset operation
		if (data == undefined) {
			thi$.control.getElement("scale").getIndicator("indicator").set('value', null);
			
			var indicators = thi$.model.additionalIndicators;
			for (var ind in indicators) {
				thi$.control.getElement("scale").getIndicator(ind).set('value', null);
			}
		}

		for (var currIndicator in data) {
			var value = data[currIndicator];
				if (value != null && value != undefined) {
					if (value.amount) {
						// duration
						value = value.amount;
					}			
					thi$.control.getElement("scale").getIndicator(currIndicator == "primaryIndicator" ? "indicator" : currIndicator).set('value', value);
				}
			} 
	},
	resizeGauge: function() {
		var thi$ = this;
		thi$.control.resize(thi$.element.parent().width(),thi$.element.parent().height());
	}
});
/*#@-*/