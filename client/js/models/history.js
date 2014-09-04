define([
	'underscore',
	'backbone'
], function( _, Backbone ) {

	var HistoryModel = Backbone.Model.extend({
		defaults: {
			
		},

		format: function() {
			var date = new Date(this.get('createtime')*1);
			this.set('f_date', this.numberFormat((date.getMonth()+1)) + '/' + this.numberFormat(date.getDate()));
			var newDate = new Date(this.get('date')*1);
			this.set('f_newdate', this.numberFormat(newDate.getHours()) + ":" + this.numberFormat(newDate.getMinutes()));
			var dec='';
			switch(this.get('type'))
			{
				case window.Type.WANT:
				   dec='邀橱神';
				break;
                case window.Type.GIVE:
				   dec='我请客';
				break;
				 case window.Type.TOGETHER:
				   dec='我拼菜';
				break;
			}
			this.set('f_dec',dec);
			return this;
		},

		numberFormat: function(n) {
			if (n < 10) {
				return '0' + n;
			};
			return n;
		}
	});

	return HistoryModel;
});
