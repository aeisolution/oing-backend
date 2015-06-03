// app/profilo/setReset.js

(function () {
    'use strict';
    var controllerId = 'pwdDimenticataCtr';
    angular.module('app').controller(controllerId, 
																		 ['$scope',
																			'logger',
																			'dataFactory', 
																			pwdDimenticataCtr]);

		function pwdDimenticataCtr($scope, logger, dataFactory) {
			$scope.user = {
				codiceFiscale: '',
				pec: ''
			};

			$scope.sendReset = function() {

				var obj = {};
				obj.codiceFiscale = $scope.user.codiceFiscale.toUpperCase();
				obj.pec = $scope.user.pec.toLowerCase();

				if (obj.codiceFiscale !== undefined && obj.pec !== undefined) {
					
					dataFactory.setUserReset(obj)
						.then(
							function(data) {
								logger.logSuccess('Richiesta di reset registrata. \
																	A breve riceverai una mail con i dati di reset al tuo indirizzo pec.');	
							},
							function(err) {
								logger.logError('Dati identificativi (Codice Fiscale e/o pec) non validi.');	
							
							}
					);
				} else {
					logger.logError('Inserire Dati identificativi (Codice Fiscale e/o pec).');
				}

			};

		}
})();