/**DEPRECATED
 * @class Adds a polling interface to any control
 * @constructs optier.control.PollingControl
 */
optier.control.PollingControl = function() {
	this.poll_iteration=0;  

}; 
optier.control.PollingControl.prototype = {
	/**#@+
	 * @memberOf optier.control.PollingControl
	 */
	pollData : function(continuous){
		var thi$ = this;
		var defer = new jQuery.Deferred();

		if(continuous){
			clearInterval(this.interval);
	 		this.poll_iteration++;
	 		if(mock_data){
				this.model.dataUrl = "test/data/chart_data" + (((this.poll_iteration)%2)+1) + ".json";	 			
	 		}
		}


		$.getJSON( thi$.buildUrl() ) 
			.done(function(script, textStatus) {
		    	thi$.value = script;

				if(continuous){
					thi$.interval = setInterval(function(){
						thi$.refresh.call(thi$, true, false, true);
					}, 10000);
				}

				defer.resolve();
		  	})
			.fail(function(jqxhr, settings, exception) {
				defer.reject( 'Failed to load data from ' +  thi$.buildUrl() + ' for Polling Control: ' + settings + ' ' + exception);
			});
			
		return defer.promise();
	}
};
/**#@-*/