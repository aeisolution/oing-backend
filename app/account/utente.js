// app/profilo/cambioPassword.js

(function () {
    'use strict';
    var controllerId = 'utenteCtrl';
    angular.module('app').controller(controllerId, 
																		 ['$scope',
																			'dataFactory', 
																			'AuthenticationFactory',
																			utenteCtrl]);

    function utenteCtrl($scope, dataFactory, AuthenticationFactory) {
        var vm = this;
				vm.status = '';
				vm.utente = {};
			
				vm.save = save;
			
				// Autenticated User
				vm.username = AuthenticationFactory.user || '';			
				$scope.$watch(
					function(scope) { return AuthenticationFactory.user },
              function(newValue, oldValue) { 
								vm.username = AuthenticationFactory.user || '';
							}
      	);
			
        //ACTIVATE *****************************************
        getProfiloUtente(vm.username);

        //****************************************************
        // METODI 
        //****************************************************
        function getProfiloUtente(username) {
            dataFactory.getProfiloUtente(username).then(function (data) {
                vm.utente = data.data;
            });
        }			

        //****************************************************
        // METODI 
        //****************************************************
        function save() {
					vm.status = '';
					
					dataFactory.updateProfiloUtente(vm.username, vm.utente)
						.then(
						function(data) {
							vm.status = 'success';
							console.log(data);
						},
						function(err) {
							showError(err.data.message);
						}
					);
        };
					
				function showError(msg) {
					vm.status = 'error';
					vm.errorMessage = msg;
				};				
    }
})();