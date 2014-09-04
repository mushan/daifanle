define([
	'underscore',
	'spin'
], function( _, Spinner ) {

	var Util = {

		startSpinning: function(id) {
			var target = document.getElementById(id);
			var spinner = new Spinner({
				color: '#aaaaaa'
			}).spin(target);
			return spinner;
		},

		stopSpinning: function(spinner) {
			spinner.stop();
		},

		api: function(url) {
			return 'http://42.62.52.155:3000/api/' + url;
		}
	}

	return Util;
});
