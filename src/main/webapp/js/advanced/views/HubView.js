var GDP = GDP || {};

GDP.view = GDP.view || {};

GDP.view.HubView = GDP.util.BaseView.extend({
    render: function(){
	this.$el.html(this.template());
	var url = this.model.get('dataSourceUrl');
	var numVars = this.model.get('availableVariables').where({'selected':true}).length;
	$('#summary-link').attr('href', url).text(url);
	$('#summary-var-count').text(numVars);
    }
});


