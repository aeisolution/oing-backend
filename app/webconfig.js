(function () {
  'use strict';
		
	var host = 'http://127.0.0.1:3000';
	
	angular.module('webconfig', [])
    .factory('webconfig', function() {
        return {
          host 		: host,
					api			: host + '/api/v1',
					download:	host + '/download'
        };
  	});
})();