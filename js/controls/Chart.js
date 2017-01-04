//
/**
 * @class A Bootstrap Charting Control based on 
 * <a href="http://nvd3.org/" target="_blank">NVD3 Re-usable charts for d3.js</a>
 * git clone from https://github.com/novus/nvd3
 * @constructs optier.control.Chart
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.Chart = function(model) {
	optier.control.BaseControl.call(this, model);
}; 
jQuery.extend( optier.control.Chart.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.Chart
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);
		this.create();
	},
	create : function(){
		var thi$ = this;
		
		thi$.addValues(thi$.model.value);

		//create
		nv.addGraph(function() {
			thi$.control = nv.models[thi$.model.type]();
			function setAxis(axis, type, label){
				switch(type){
					case "Date":
						axis
							.axisLabel(label || 'Date')
							.tickFormat(function(d) {
								return d3.time.format('%x')(new Date(d));
							});
						break;
					case "WholeNumber":
						axis
							.axisLabel(label || 'Value')
							.tickFormat(d3.format(',f'));
						break;
					case "Duration":
						axis
							.axisLabel(label || 'Duration(ms)')
							.tickFormat(d3.format(',f'));
						break;
					case "DecimalNumber":
						axis
							.axisLabel(label || 'Value')
							.tickFormat(d3.format(',.01'));
						break;
					default:
						axis
							.axisLabel(label || 'Value')
							.tickFormat(d3.format(',f'));
						//.tickFormat(d3.format('.02f'));
				}
			}
			
			switch(thi$.model.type){
				case "discreteBarChart":
					thi$.control
						.staggerLabels(true)
						.tooltips(true)
						.showValues(true);

					//thi$.control.yAxis.axisLabel(thi$.model.yAxisName);
					//thi$.control.xAxis.axisLabel(thi$.model.xAxisName);

					break;
				case "pieChart":
					thi$.control
						.showLabels(true);
					break;
				case "lineChart":
					setAxis(thi$.control.xAxis, thi$.model.xType, thi$.model.xAxisName);
					setAxis(thi$.control.yAxis, thi$.model.yType, thi$.model.yAxisName);
					break;
			}



			thi$.refresh();
		
			nv.utils.windowResize(thi$.control.update);

		});						
		
	},
	/**
	 * processing the poller return will call this function to add the 
	 * delta data and then refresh the ui to reflect that
	 * @param {[type]} value [{"key": "series name","values": [{x:3,y:4},...]}];
	 */
	addValues : function(value){
		var thi$ = this;

		//TODO: Handle number of series limitations
		// if (value) { 
		// 	if (value.length > thi$.model.maxNumberOfSeries) {
		// 		value = value.splice(0,thi$.model.maxNumberOfSeries);	
		// 	}

		// 	var i;
		// 	for (i in value) {
		// 		var valArr;
		// 		if (value[i]) {
		// 			valArr = value[i].values;
		// 		}
		// 		 if (valArr) {
		// 		 	if (valArr.length > thi$.model.maxNumberOfValuesPerSeries) {
		// 		 		valArr = valArr.splice(0, thi$.model.maxNumberOfValuesPerSeries);
		// 		 	}
				 		
		// 		}
		// 	}	
		// }

		
		if(this.value){
			$(value).each(function(i, serie){
				var matchedSerie = false;
				$(thi$.value).each(function(i, existing_serie){
					if(existing_serie.key == serie.key){
						switch(thi$.model.type){
							case "lineChart":
								existing_serie.values = existing_serie.values.concat(serie.values); 
								break;
							case "discreteBarChart":
							case "pieChart":
								$(serie.values).each(function(j, record){
									var matchedRecord = false;
									$(existing_serie.values).each(function(j, existing_record){
										if(existing_record.x == record.x){
											existing_record.y = record.y; 
											matchedRecord = true;
										}
									});
									if(!matchedRecord){
										existing_serie.values.push(record);
									}
								});
								break;
						}
						matchedSerie = true;
					}
				});
				if(!matchedSerie){
					thi$.value.push(serie);
				}
			});
		}else{
			this.value = value || [];
		}

		if(this.control){
			this.refresh();
		}
	},
	refresh : function(){
		d3.select('#' + this.containerID + ' svg')
	    	.datum(this.value)
	    	.transition().duration(500)
	    	.call(this.control);
	},
	/**
	 * genereate mock data for the chart
	 * two sets of data a cosin and sin
	 * @return {[type]} [description]
	 */
	generateData : function(){
		this.value = function() {
			var sin = [],
			cos = [];
			for (var i = 0; i < 100; i++) {
				var random = Math.floor((Math.random()*100)+1);
				sin.push({x: i, y: Math.sin(random/10)});
				cos.push({x: i, y: .5 * Math.cos(random/10)});
			}

			return [
				{
					values: sin,
					key: 'Sine Wave',
					color: '#ff7f0e'
				},
				{
					values: cos,
					key: 'Cosine Wave',
					color: '#2ca02c'
				}
			];
 		}();
	},
	/**
	 * you'll get here on a poller reset operation
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	applyValue : function(value){
		var thi$ = this;
		if( typeof value == "string"){
			//reset for a given serie name (removing it from the value array)
			$(this.value).each(function(i, serie){
				if(serie.key == value){
					thi$.value.splice(i,1);
					return;
				}
			});
		}else{
			this.value = value || [];			
		}

		this.refresh();
		//reset the previously rendered chart (to overcome discreteBarChart render bug)
		if(this.value.length == 0){
			this.element.find("svg > g").remove();
		}
		this.control.update();
	},
	/**
	 * DEPRECATED: merges to value set with the x as the compare criteria and the y the value criteria 
	 * @param  {[type]} a1 [description]
	 * @param  {[type]} a2 [description]
	 * @return {[type]}    [description]
	 */
	merge : function(a1, a2){
		var ret = [];
		$(a1).each(function(i,item){
			$(a2).each(function(j,item2){
				if( item.x == item2.x){
					ret.push({ 	x : item.x, 
								y : (item.y + item2.y) })
				}
			});
		});
		return ret;
	}



});
/**#@-*/