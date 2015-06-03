(function () {
    'use strict';

    angular.module('app').factory('logger', ['$log', logger]);

    function logger($log) {
        var service = {
            log: log,
            logError: logError,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return service;

        function log(message) {
            logIt(message, 'info');
        }

        function logWarning(message) {
            logIt(message, 'warning');
        }

        function logSuccess(message) {
            logIt(message, 'success');
        }

        function logError(message) {
            logIt(message, 'error');
        }

        function logIt(message, toastType) {
					if (toastType === 'error') {
							toastr.error(message);
					} else if (toastType === 'warning') {
							toastr.warning(message);
					} else if (toastType === 'success') {
							toastr.success(message);
					} else {
							toastr.info(message);
					}
        }
    }
})();