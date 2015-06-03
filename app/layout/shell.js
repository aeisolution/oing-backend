(function () {
    'use strict';

		var app = angular.module('app');
	
    var controllerId = 'shell';
    app.controller(controllerId,
        ['$scope', '$location', '$rootScope', 'AuthenticationFactory', 'UserAuthFactory', shell]);

    function shell($scope, $location, $rootScope, AuthenticationFactory, UserAuthFactory) {
      var vm = this;
			vm.isLogged = AuthenticationFactory.isLogged;
			vm.logout = UserAuthFactory.logout;
			
				// Autenticated User
				vm.username = AuthenticationFactory.user || '';			
				$scope.$watch(
					function(scope) { return AuthenticationFactory.isLogged },
              function(newValue, oldValue) { 
								vm.isLogged = newValue; 
								vm.username = AuthenticationFactory.user || 'utente';
							}
      	);
    };
})();