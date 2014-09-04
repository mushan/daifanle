define([
	'underscore',
	'backbone'
], function( _, Backbone ) {

	var CommentModel = Backbone.Model.extend({
		defaults: {
			
		},

		format: function() {
			var date = new Date(this.get('createtime')*1);
			this.set('f_date', this.numberFormat((date.getMonth()+1)) + '-' + this.numberFormat(date.getDate()) + " " + this.numberFormat(date.getHours()) + ":" + this.numberFormat(date.getMinutes()));
			
			if (this.get('reply_name')) {
				this.set('f_text', "回复 " + this.get('reply_name') + ": " + this.get('text'));
			} else {
				this.set('f_text', this.get('text'));
			};
			return this;
		},

		numberFormat: function(n) {
			if (n < 10) {
				return '0' + n;
			};
			return n;
		}
	});

	return CommentModel;
});
