/**DEPRECATED
 * @class A Bootstrap Charting Control based on 
 * <a href="http://nvd3.org/" target="_blank">NVD3 Re-usable charts for d3.js</a>
 * @constructs optier.control.BarChartPollingControl
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.BarChartPollingControl = function(model) {
	optier.control.BaseControl.call(this, model);
	optier.control.PollingControl.call(this);
}; 
jQuery.extend( optier.control.BarChartPollingControl.prototype,
			   optier.control.PollingControl.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.BarChartPollingControl
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);
		this.refresh(true,true,true);
	},
	refresh : function( fetchData, create, continuous ){
		var thi$ = this;
		
		if( fetchData ){
			this.pollData(continuous).promise().then(
				function(msg) {
					if(create){
						nv.addGraph(function() {
							thi$.control = nv.models.discreteBarChart()
						      .x(function(d) { return d.label })
						      .y(function(d) { return d.value })
						      .staggerLabels(true)
						      .tooltips(true)
						      .showValues(true);

							d3.select('#' + thi$.containerID + ' svg')
						    	.datum(thi$.value)
						    	.transition().duration(500)
						    	.call(thi$.control);
						
							nv.utils.windowResize(thi$.control.update);
						});
					}else{
						d3.select('#' + thi$.containerID + ' svg')
					    	.datum(thi$.value)
					    	.transition().duration(500)
					    	.call(thi$.control);
					}
					
				},
				function(msg) {
					alert(msg);
				}
			);			
		}else{
			d3.select('#' + this.containerID + ' svg')
			    	.datum(this.value)
			    	.transition().duration(500)
			    	.call(this.control);
		}
	},
	add : function(params){
		this._addRecord(params[0], params[1]);
	},
	_addRecord : function(label, value){
		this.value[0].values.push({"label" : label, "value" : value});
		this.refresh();
		
	},
	addValue : function(value){
		var thi$ = this;
		$(value).each(function(i, rec){
			thi$._addRecord(rec.x, rec.y);			
		});
	}



});
/**#@-*/