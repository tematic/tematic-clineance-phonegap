var app = {
    initialize: function() {
    	var deviceReadyDeferred = $.Deferred(),
    		jqmReadyDeferred = $.Deferred(),
    		jqmCreateDeferred = $.Deferred()
    	;

    	document.addEventListener("deviceReady", deviceReadyDeferred.resolve, false);
    	
    	$(document).one("mobileinit", function() {
    		$.support.cors = true;
    	    $.mobile.allowCrossDomainPages = true;
    	    $.mobile.phonegapNavigationEnabled = true;
    	    
			jqmReadyDeferred.resolve();
		});
    	
    	$("#startpage").bind('pageshow', jqmCreateDeferred.resolve);
    	
    	$.when(deviceReadyDeferred, jqmReadyDeferred, jqmCreateDeferred).then(this.load());
    },
    load: function() {    	
    	var $deviceState = $('#devicestate');
    	
    	$deviceState.children('*').hide();
    	$('.connecting', $deviceState).show();
    	
    	$.getJSON(app.url('/crud/auth/is'))
    	.done(function(data) {
    		if(typeof data == 'object' && typeof data.url == 'string') {
            	$deviceState.children('*').hide();
        		$('.loading', $deviceState).show();
        		document.location = app.url(data.url);
    		} else {
            	$deviceState.children('*').hide();
        		$('.no-network', $deviceState).show();
    		}
    	})
    	.fail(function() {
        	$deviceState.children('*').hide();
    		$('.no-network', $deviceState).show();
    	});
    },
    url: function(path) {
    	return 'http://192.168.1.14' + (path.substr(0,1) == '/' ? '' : '/') + path;
    }
};
app.initialize();