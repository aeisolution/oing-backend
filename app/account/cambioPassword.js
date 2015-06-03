// app/profilo/cambioPassword.js

(function () {
    'use strict';
    var controllerId = 'cambioPasswordCtrl';
    angular.module('app').controller(controllerId, 
																		 ['$scope',
																			'dataFactory', 
																			'AuthenticationFactory',
																			cambioPasswordCtrl]);

    function cambioPasswordCtrl($scope, dataFactory, AuthenticationFactory) {
        var vm = this;
				vm.title = 'Profilo Utente - Cambio Password';
				vm.status = '';
			
				vm.changePassword = changePassword;
			
				// Autenticated User
				vm.username = AuthenticationFactory.user || '';			
				$scope.$watch(
					function(scope) { return AuthenticationFactory.user },
              function(newValue, oldValue) { 
								vm.username = AuthenticationFactory.user || '';
							}
      	);
			

        //****************************************************
        // METODI 
        //****************************************************
        function changePassword() {
					vm.status = '';
					
					if(!vm.pwdOld || !vm.pwd || !vm.pwdConfirm) {
						return showError('inserire dati');
					}
						 
					if(vm.pwd != vm.pwdConfirm) {
						return showError('Password e Conferma non corrispondenti');
					}
						 
					var obj = {
						username: vm.username,
						pwdOld:		vm.pwdOld,
						pwd:			vm.pwd
					}
					
					dataFactory.changePassword(obj)
						.then(
						function(data) {
							init();
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
					init();
				};
			
				function init() {
					vm.pwdOld = '';
					vm.pwd = '';
					vm.pwdConfirm = '';
				};
				
    }
})();