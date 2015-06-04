(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        'ngMessages',	      // Validation Messages

        // 3rd Party Modules
        'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog)
				'toastr',
				'textAngular'
    ]);

    //app.constant('_', _);     // Lodash library
  
	
    // Handle routing errors and success events
    app.run(function($rootScope, $window, $location, AuthenticationFactory) {
			// when the page refreshes, check if the user is already logged in
			AuthenticationFactory.check();

			$rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
				if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
					$location.path("/login");
				} else {
					// check if user object exists else fetch it. This is incase of a page refresh
					if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
					if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
				}
			});

			$rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
				$rootScope.showMenu = AuthenticationFactory.isLogged;
				$rootScope.role = AuthenticationFactory.userRole;
				
				// if the user is already logged in, take him to the home page
				if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
					$location.path('/dashboard');
				}
			});
	});
	
})();
