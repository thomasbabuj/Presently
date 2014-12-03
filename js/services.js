/*
* Services persists across controllers, for the
* Duration of the application's lifetime and its the 
* right place to hide the business logic from the controller.  
*/

angular.module('myApp', [])
	.provider('Weather', function() {
		// Wunderground API key
		var apiKey = '';

		this.setApiKey = function(key) {
			if( key ) 
				this.apiKey = key;
		};

		this.$get = function($http) {
			return {
				// Service object
			}
		}

	});