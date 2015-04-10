var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.HubView = GDP.util.BaseView.extend({
    model: GDP.ADVANCED.model.job,
    render: function(){
	this.$el.html(this.template());
	var url = this.model.get('dataSource').get('url');
	$('#summary-link').attr('href', url).text(url);
	
    }
});


