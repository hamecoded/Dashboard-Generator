/**
 * @class A Bootstrap FuelUX Grid Control
 * http://exacttarget.github.com/fuelux/#datagrid
 * @constructs optier.control.TableControl
 * @augments optier.control.BaseControl
 * @param {json} model The model to instanciate that control
 */
optier.control.TableControl = function(model) {
	optier.control.BaseControl.call(this, model);
	this.value = undefined; //holds the selected row value only
	/*
	a StaticDataSource object holding both columns and data
	so this.dataSource._data is the actual value/content of the table */
	this.dataSource = undefined; 
}; 
jQuery.extend( optier.control.TableControl.prototype,
               optier.control.BaseControl.prototype,{
	/**#@+
	 * @memberOf optier.control.TableControl
	 */
	init : function(){
		optier.control.BaseControl.prototype.init.call(this);
		var thi$ = this;

		if(mock_data){
			$.getJSON('test/data/table_data1.json')
				.success( function(data) {
					thi$.create(data);
				})
				.error( function(jqxhr, settings, exception) {
					var ret_msg = "";
					if(exception instanceof Error){
						ret_msg = 'Failed fetching table data! ' + settings + ' ' + exception.message;
					}
					else if(typeof exception === "string"){
						ret_msg = 'Failed fetching table data! ' + settings + ' ' + exception + ' with state: ' + jqxhr.state();
					}else{
						ret_msg = 'Failed fetching table data! ' + settings + ' ' + exception.arguments[0] + ' ' + exception.type;
					}
					alert(ret_msg);
				});
		}else{
			thi$._enableSorting();
			this.parseDataTypes(thi$.model.value);
			thi$.create({
				"columns" : thi$.model.columns,
				"data" : thi$.model.value || []
			});			
		}
		
	},
	_bind : function(){
		var thi$ = this;

		thi$.element.on("click", "tr", function(event){
			event.stopImmediatePropagation(); //Prevents double firing of the event
			var tr = $(this);
			//enable visual selection 
			if(thi$.model.enableSelection){
				tr.parent().find("tr").removeClass("selected");
				tr.addClass("selected");
			}
			//fire an event on row selection
			if(thi$.model.event){
				var cols = [];
				for ( i in thi$.model.columns){
					var col = thi$.model.columns[i];
					cols.push(col.property);
				}
				var row = {};
				tr.find("td").each(function(i, td){
					if($(td).find('span').length > 0){
						row[ cols[i] ] =  JSON.parse( $(td).find('span').text() );
					}else{
						row[ cols[i] ] = $(td).html();
					}
				});

				//TODO: need centrelizing DataTypes conversions and localizations(date)
				//parse back data formatted values to their raw value only to be sent back to the server
				/*for ( i in thi$.model.columns){
					var col = thi$.model.columns[i];
					var cellValue = row[col.property];
					if(cellValue){
						switch(col.type){
							case "Date":
								row[col.property] = oLocal.fromDateTimeShortFormat(cellValue);
								break;
							case "ColorIndicator":
								row[col.property] = $(cellValue).data("value");
								break;
							case "Duration":
								row[col.property] = { "amount" :cellValue };
								break;
						}						
					}else{
						cellValue = null;
					}
				}*/
				thi$.setValue(row);
				oPoller.send(thi$);
			}
		});
		
		$(window).resize(function(event){
			thi$.resizeTable();
		});

	},
	/**
	 * sets the value of the selected row
	 * @param {[type]} value [description]
	 */
	setValue : function(value){
		this.value = value;
		oPoller.update(this);
	},
	_enableSorting : function(){
		$(this.model.columns).each(function(i,col){
			col.sortable = true;
		});
	},
	/**
	 * DEPRECATED: transforms the columns data structure from the server to property:label 
	 * @return {[type]} [description]
	 */
	buildColumns : function(){
		var thi$ = this;
		var cols = [];
		$(thi$.model.columns).each(function(i,col){
			cols.push({
				"property" : col.type,
				"label" : col.name,
				"sortable" : true
			});
		});
		return cols;
	},
	addRow : function(row){
		this.dataSource.data.push(row); 
		this.element.datagrid("reload");
	},
	create : function(data){
		var thi$ = this;

		require({
			    packages: [
			        { name: "fuelux", location: "fuelux" },
			        { name: "underscore", location: "../js/vendor", main: "underscore" }
			    ]
			},
			[ 'fuelux/sample/datasource', 'fuelux/dist/combobox', 'fuelux/dist/search', 'fuelux/dist/datagrid' ], 
			function (StaticDataSource) {

			// DATAGRID
			thi$.dataSource = new StaticDataSource({
				columns: data.columns,
				data: data.data,
				delay: 250
			});

			thi$.element.datagrid({
				dataSource: thi$.dataSource,
				stretchHeight: true
			});

			thi$.resizeTable();
			thi$._bind();
		});
	},
	resizeTable : function(){
		//fix table control footer on pane width change
		$(".pane-content.controls .datagrid-stretch-wrapper").each(function(i,grid){
			if($(grid).width() < 350){
				 $(grid).find("+ .datagrid-stretch-footer .grid-controls").hide();  
			}else{
				 $(grid).find("+ .datagrid-stretch-footer .grid-controls").show();  
			}

			var height = $(grid).parent().parent().height();
			height -= (89+61);
			$(grid).height( height );
		});
	},
	/**
	 * processing the poller return will call this function to add the 
	 * delta data and then refresh the ui to reflect that
	 * add algorithm: each new row is checked against existing rows id and 
	 *                replaced if a match is found or added as new otherwize 
	 * @param {[type]} value [description]
	 */
	addValues : function(value){
		var thi$= this;
		this.parseDataTypes(value);
		$(value).each(function(i, row){
			var existing_rows = thi$.dataSource._data;
			var exists = false;
			$(existing_rows).each(function(j, existing_row){
				if(existing_row.id == row.id){
					exists = true;
					existing_rows.splice(j,1,row);
					return;
				}
			});
			if(!exists){
				existing_rows.push(row);
			}
		});
		this.element.datagrid("reload");
	},
	/**
	 * the entire data is replaced with the recieved one, 
	 * incase value is undefined that corresponds to a reset action
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	applyValue : function(value){
		this.dataSource._data = value || [];
		this.element.datagrid("reload");
	},
	/**
	 * FUTURE support for colorIndicator in tables
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	parseDataTypes : function(value){
		var thi$= this;
		var colsDef = thi$.model.columns;
		$(value).each(function(i, row){
			for(var col in row){
				var colModel;;
				//lookup type in columns model
				$(colsDef).each(function(i, colDef){
					if(col == colDef.property){
						colModel = colDef;
						return;
					}
				});
				//modify cell value to reflect data type
				switch(colModel.type){
					case "ColorIndicator":
						var valueClass;
						switch(row[col]){
							case colModel.greenText:
								valueClass = "ci-green";
								break;
							case colModel.yellowText:
								valueClass = "ci-yellow";
								break;
							case colModel.redText:
								valueClass = "ci-red";
								break;
						}
						value[i][col] = "<span class=hidden>" + row[col] + "</span>" + 
										'<div class="colorindicator ' + valueClass + '"></div>';
						break;
					case "Date":
						var date = new Date(row[col]);
						value[i][col] = "<span class=hidden>" + row[col] + "</span>" +
										oLocal.toDateTimeShortFormat(date);
						break;
					case "Duration":
						value[i][col] = "<span class=hidden>" + JSON.stringify(row[col]) + "</span>" + 
										secondsToString(row[col].amount/1000);
						break;
				}
				value[i][col] = value[i][col] || "";
			}
		});
	}
	

});
/*#@-*/
