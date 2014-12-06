angular.module('myApp', ['ngRoute'])

	.provider('Weather', function() {
		var apiKey = '';

		this.getUrl = function(type,ext) {
			return "http://api.wunderground.com/api/"+
				this.apiKey+ "/"+ type + "/q/" + ext + '.json';
		};

		this.setApiKey = function(key) {
			if (key) this.apiKey = key;
		};

		this.$get =function($q,$http) {
			var self = this;
			return {
				// Service object
				getWeatherForecast : function(city) {					
					var d = $q.defer();
					$http({
						method: 'GET',
						url : self.getUrl("forecast", city),
						cache : true
					}).success(function(data) {						
						// The wunderground API returns the 
						// object that nests the forecasts inside 
						// the forecast.simpleforecast key
						d.resolve(data.forecast.simpleforecast);
					}).error(function(err){
						d.reject(err);
					});
					return d.promise;
				}
			}
		}
	})
	.factory('UserService', function(){
		var defaults = {
			location : 'autoip'
		};
		
		var service = {
			user : {},
			save : function() {
				sessionStorage.presently =
					angular.toJson(service.user);
			},
			restore : function() {
				// Pull from sessionStorage				
				service.user = angular.fromJson(sessionStorage.presently ) || defaults;			
				return service.user;	
			}
		};

		//Immediately call restore from the session storage 
		// so we have our user data available immediately
		service.restore();

		return service;
	})
	.config(function(WeatherProvider){
		WeatherProvider.setApiKey('80c081fda40c2009');
	})
	.config(function($routeProvider){
		$routeProvider.when('/', {
			templateUrl : 'templates/home.html',
			controller : 'MainCtrl'
		})
		.when('/settings', {
			templateUrl : 'templates/settings.html',
			controller : 'SettingsCtrl'
		})
		.otherwise({ redirectTo:'/' });
	})
	.controller('MainCtrl', function($scope, $timeout, Weather) {
		// Build date object
		$scope.date = {};

		$scope.weather = {};

		// Getting San Francisco for now
		Weather.getWeatherForecast("Singapore/Singapore")
		.then(function(data){
			$scope.weather.forecast = data;
		});

		// Update function
		var updateTime = function() {
			$scope.date.raw = new Date(); $timeout(updateTime, 1000);
		}

		// Kick off the update function
		updateTime();
	})
	.controller('SettingsCtrl', function($scope, UserService){	
		$scope.user = UserService.user;

		$scope.save = function() {
			UserService.save();
		}
	});