angular.module('myApp', [])

	.provider('Weather', function() {
		var apiKey = '';

		this.getUrl = function(type,ext) {
			return "http://api.wunderground.com/api/"+
				this.apiKey+ "/"+ type + "/q/" + ext + '.json';
		};

		this.setApiKey = function(key) {
			if (key) this.apiKey = key;
		};

		this.$get =function($http) {
			return {
				// Service object
			}
		}
	})
	.config(function(WeatherProvider){
		WeatherProvider.setApiKey('80c081fda40c2009');
	})
	.controller('MainCtrl', function($scope, $timeout) {
		// Build date object
		$scope.date = {};

		// Update function
		var updateTime = function() {
			$scope.date.raw = new Date(); $timeout(updateTime, 1000);
		}

		// Kick off the update function
		updateTime();
	});