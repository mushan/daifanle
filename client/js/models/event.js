define([
	'underscore',
	'backbone'
], function( _, Backbone ) {

	var EventModel = Backbone.Model.extend({
		defaults: {
			f_date: '',
			f_people_count: '',
			f_type: '',
			f_create_time: '',
			f_desc: ''
		},

		format: function() {
			// this.set();
			var date = new Date(this.get('date')*1);
			var create_time = new Date(this.get('createtime')*1);
			this.set('f_date', this.numberFormat((date.getMonth()+1)) + '/' + this.numberFormat(date.getDate()));

			var now = new Date().getTime();
			if (((now - create_time)/(24*3600*1000)) < 1) {
				this.set('f_create_time', this.numberFormat((create_time.getHours()+1)) + ':' +  this.numberFormat(create_time.getMinutes()) + '发布');
			} else {
				this.set('f_create_time',  this.numberFormat((create_time.getMonth()+1)) + '月' +  this.numberFormat(create_time.getDate()) + '日 ' +  this.numberFormat((create_time.getHours()+1)) + ':' +  this.numberFormat(create_time.getHours())+ '发布');
			};

			var type = this.get('type');
			if (type == window.Type.GIVE) {
				this.set('f_type', '蹭饭');
				this.set('f_desc', '厨神'+this.get('name') + '喊你来蹭饭！');
			} else if(type == window.Type.TOGETHER) {
				this.set('f_type', '拼菜');
				this.set('f_desc', '小伙伴们，拼起来吧！');
			} else if(type == window.Type.WANT) {
				this.set('f_type', '应聘');
				this.set('f_desc', '好心的厨神帮忙做吧！');
			};

			if (type == window.Type.GIVE) {
				this.set('f_people_count', '邀'+this.get('limit') + '人');
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

	return EventModel;
});
