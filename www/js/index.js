var app = {
	urlRoot: null,
	initialize: function(urlRoot, urlPing, urlApp) {
		var deviceReadyDeferred = $.Deferred(),
			jqmReadyDeferred = $.Deferred(),
			jqmCreateDeferred = $.Deferred()
		;
		this.urlRoot = urlRoot;

		document.addEventListener("deviceReady", deviceReadyDeferred.resolve, false);

		$(document).one("mobileinit", function() {
			$.support.cors = true;
			$.mobile.allowCrossDomainPages = true;
			$.mobile.phonegapNavigationEnabled = true;
			jqmReadyDeferred.resolve();
		});

		$("#startpage").bind('pageshow', jqmCreateDeferred.resolve);

		$.when(deviceReadyDeferred, jqmReadyDeferred, jqmCreateDeferred).then(this.load(urlPing, urlApp));
	},
	load: function(urlPing, urlApp) {		
		var $deviceState = $('#devicestate');

		$deviceState.children('*').hide();
		$('.connecting', $deviceState).show();

		$.ajax({
			type: 'GET',
			url: app.url(urlPing),
			data: null,
			dataType: 'text',
			cache: false
		})
		.done(function(data) {
			$deviceState.children('*').hide();
			$('.loading', $deviceState).show();
			document.location = app.url(urlApp);
		})
		.fail(function(a) {
			$deviceState.children('*').hide();
			$('.no-network', $deviceState).show();
		});
	},
	url: function(path) {
		return this.urlRoot + (path.substr(0,1) == '/' ? '' : '/') + path;
	}
};
app.initialize('http://patient.site-medecin.com', '/ping.txt', '/');