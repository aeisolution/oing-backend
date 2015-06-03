// app/profilo/setReset.js

(function () {
    'use strict';
    var controllerId = 'resetCtr';
    angular.module('app').controller(controllerId, 
																		 ['$routeParams',
																			'logger',
																			'dataFactory', 
																			resetCtr]);

		function resetCtr($routeParams, logger, dataFactory) {
			var vm = this;

      vm.params = $routeParams;
			vm.status = '';
			vm.active = false;
			vm.errorMessage = '';
			
      vm.user = {};
			vm.send = send;
			

      //ACTIVATE *****************************************
			check(vm.params);
			
			
			function check(params) {
				dataFactory.checkToken(params)
					.then(
						function(data) {
							vm.active = true;
							vm.status = 'info';
						},
						function(err) {
							vm.active = false;
							vm.status = 'error';
							vm.errorMessage = 'Dati di reset non validi!'
						}
				);
			}
			
			
			function send() {

				if(!vm.pwd || !vm.pwdConfirm) {
					return showError('inserire nuova Password');
				}

				if(vm.pwd != vm.pwdConfirm) {
					return showError('Password e Conferma non corrispondenti');
				}
				
				var obj = {};
				obj.username 	= vm.params.username || '';
				obj.pec 			= vm.params.pec || '';
				obj.token 		= vm.params.token || '';
				obj.pwd 			= vm.pwd || '';
				
				
				dataFactory.resetPwd(obj)
					.then(
						function(data) {
							return vm.status = 'success';
							init();
						},
						function(err) {
							return showError('Errore di reset password.');
						}					
				);
				


			};
			
				function showError(msg) {
					vm.status = 'error';
					vm.errorMessage = msg;
					init();
				};
			
				function init() {
					vm.pwd = '';
					vm.pwdConfirm = '';
				};
			

		}
})();