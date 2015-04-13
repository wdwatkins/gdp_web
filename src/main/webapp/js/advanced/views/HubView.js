var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.HubView = GDP.util.BaseView.extend({
    render: function(){
	this.$el.html(this.template());
	var dataSource = GDP.ADVANCED.model.dataSource;
	var url = dataSource.get('url');
	var numVars = dataSource.get('variables').where({'selected':true}).length;
	$('#summary-link').attr('href', url).text(url);
	$('#summary-var-count').text(numVars);
    }
});


