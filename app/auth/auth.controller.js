(function () {
  'use strict';

  var app = angular.module('app');
	
	app.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory', 'toastr',
		function($scope, $window, $location, UserAuthFactory, AuthenticationFactory, toastr) {
			var vm = this;
			
			vm.user = {
				username: '',
				password: ''
			};

			vm.login = function() {

				var username = vm.user.username,
					password = vm.user.password;

				if (username !== undefined && password !== undefined) {
					UserAuthFactory.login(username, password).success(function(data) {

						AuthenticationFactory.isLogged = true;

						AuthenticationFactory.user = data.user.username;
						AuthenticationFactory.userRole = data.user.role;

						$window.sessionStorage.token = data.token;
						$window.sessionStorage.user = data.user.username; // to fetch the user details on refresh
						$window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh

						
						$location.path("/dashboard");

					}).error(function(status) {
						vm.user.password = '';
						toastr.error('Username e/o password errate.');
					});
				} else {
					toastr.error('inserire credenziali di accesso');
				}

			};

		}
	]);
})();