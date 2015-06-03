(function () {
    'use strict';

    var app = angular.module('app');

		//toastr Config
		app.config(function(toastrConfig) {
			angular.extend(toastrConfig, {
				positionClass: 'toast-bottom-right',
				timeOut: 2000
			});
		});		
	
    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

})();