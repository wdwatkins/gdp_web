/*jslint browser: true*/

var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.ProcessView = GDP.util.BaseView.extend({
	render : function () {
		this.$el.html(this.template(this.collection.models));
		return this;
	}
});