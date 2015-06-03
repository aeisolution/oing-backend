(function () {
  'use strict';

  var app = angular.module('app');
	//var urlBase = 'http://api.network-giovani.net';
	var urlBase = 'http://127.0.0.1:3000';
	
	app.factory('AuthenticationFactory', function($window) {
		var auth = {
			isLogged: false,
			check: function() {
				if ($window.sessionStorage.token && $window.sessionStorage.user) {
					this.isLogged = true;
					this.user = $window.sessionStorage.user;
					this.userRole = $window.sessionStorage.userRole;					
				} else {
					this.isLogged = false;
					delete this.user;
				}
			}
		}

		return auth;
	});

	app.factory('UserAuthFactory', function($window, $location, $http, AuthenticationFactory) {
		return {
			login: function(username, password) {
				return $http.post(urlBase +'/login', {
					username: username,
					password: password
				});
			},
			logout: function() {

				if (AuthenticationFactory.isLogged) {

					AuthenticationFactory.isLogged = false;
					delete AuthenticationFactory.user;
					delete AuthenticationFactory.userRole;

					delete $window.sessionStorage.token;
					delete $window.sessionStorage.user;
					delete $window.sessionStorage.userRole;

					$location.path("/login");
				}

			}
		}
	});

	app.factory('TokenInterceptor', function($q, $window) {
		return {
			request: function(config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.token) {
					config.headers['X-Access-Token'] = $window.sessionStorage.token;
					config.headers['X-Key'] = $window.sessionStorage.user;
					config.headers['Content-Type'] = "application/json";
				}
				return config || $q.when(config);
			},

			response: function(response) {
				return response || $q.when(response);
			}
		};
	});
})();