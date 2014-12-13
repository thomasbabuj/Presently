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
	.directive('autoFill', function($timeout) {
		console.log ('in autofill');
		return  {
			restrict : 'EA',
			scope : {
				autoFill : '&',
				ngModel : '='
			},
			compile : function(tEle, tAttrs) {
				var tplEl = angular.element('<div class="typeahead">' +
					'<input type="text" autocomplete="off" />' +
					'<ul id="autolist" ng-show="reslist">' +
					'<li ng-repeat="res in reslist"' + '>{{res.name}}' +
					'</ul>' +
					'</div>');
				var input = tplEl.find('input');
				input.attr('type', tAttrs.type);
				input.attr('ng-model', tAttrs.ngModel);
				tEle.replaceWith(tplEl);

				return function(scope, ele, attrs, ctrl) {

				}
			}
		}
	})
	.controller('MainCtrl', function($scope, $timeout, Weather, UserService) {
		// Build date object
		$scope.date = {};

		$scope.weather = {};

		$scope.user = UserService.user;
		
		Weather.getWeatherForecast( $scope.user.location )
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