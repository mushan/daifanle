define([
	'underscore',
	'backbone'
], function( _, Backbone ) {

	var MenuModel = Backbone.Model.extend({
		defaults: {
			
		},

		format: function() {
			// var date = new Date(this.get('date')*1);
			// this.set('f_date', this.numberFormat((date.getMonth()+1)) + '-' + this.numberFormat(date.getDate()) + " " + this.numberFormat(date.getHours()) + ":" + this.numberFormat(date.getMinutes()));
			return this;
		}
	});

	return MenuModel;
});
