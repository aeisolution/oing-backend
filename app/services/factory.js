(function () {
  'use strict';

  var app = angular.module('app');
	
	app.factory('dataFactory', function($http) {
		//var urlBase = 'http://api.network-giovani.net/api/v1';
		//var urlBase = 'http://127.0.0.1:3000/api/v1';
		var urlBase = 'http://127.0.0.1:3000/api/v1';
		var _Factory = {};

		// --- ACCOUNT -----
		_Factory.changePassword = function(obj) {
			return $http.post(urlBase + '/accounts/pwd/change', obj);
		}; 

		// --- PROFILO -----
		_Factory.getProfiloUtente = function(username) {
			return $http.get(urlBase + '/profilo/' + username);
		}; 
		
		_Factory.updateProfiloUtente = function(username, obj) {
			return $http.post(urlBase + '/profilo/' + username, obj);
		}; 
		
		// --- COMMISSIONI -----
		_Factory.getCommissioni = function() {
			return $http.get(urlBase + '/commissioni');
		}; 

		_Factory.getCommissione = function(id) {
			return $http.get(urlBase + '/commissioni/' + id);
		}; 
		
		_Factory.postCommissione = function(obj) {
			return $http.post(urlBase + '/commissioni', obj);
		};

		_Factory.putCommissione = function(id, obj) {
			return $http.put(urlBase + '/commissioni/' + id, obj);
		};

		_Factory.deleteCommissione = function(id) {
			return $http.delete(urlBase + '/commissioni/' + id);
		};
		
		_Factory.postComponente = function(id, obj) {
			return $http.post(urlBase + '/commissioni/' + id + '/componente', obj);
		};

		_Factory.deleteComponente = function(id, sezione, numero) {
			return $http.delete(urlBase + '/commissioni/' + id + '/componente/' + sezione + '/' + numero);
		};

		//Consiglieri Territorio e Disciplina
		_Factory.postConsigliereT = function(id, obj) {
			return $http.post(urlBase + '/consiglio/territorio/' + id + '/componente', obj);
		};

		_Factory.deleteConsigliereT = function(id, sezione, numero) {
			return $http.delete(urlBase + '/consiglio/territorio/' + id + '/componente/' + sezione + '/' + numero);
		};
		
		_Factory.postConsigliereD = function(id, obj) {
			return $http.post(urlBase + '/consiglio/disciplina/' + id + '/componente', obj);
		};

		_Factory.deleteConsigliereD = function(id, sezione, numero) {
			return $http.delete(urlBase + '/consiglio/disciplina/' + id + '/componente/' + sezione + '/' + numero);
		};

		//Collegio
		_Factory.postCollegio = function(id, obj) {
			return $http.post(urlBase + '/consiglio/disciplina/' + id + '/collegio', obj);
		};

		_Factory.deleteCollegio = function(id, numero) {
			return $http.delete(urlBase + '/consiglio/disciplina/' + id + '/collegio/' + numero);
		};
		
		//*************************************************
		// Metodi per API Base
		//*************************************************
		_Factory.baseGetPage = function(entity, page) {
			var p = page || '1';
			return $http.get(urlBase + '/' + entity + '/page/' + p);
		};
		
		_Factory.baseCountPage = function(entity) {
			return $http.get(urlBase + '/' + entity + '/count/page');
		};
		
		_Factory.baseCount = function(entity) {
			return $http.get(urlBase + '/' + entity + '/count');
		};

		_Factory.baseGetAll = function(entity) {
			return $http.get(urlBase + '/' + entity);
		};
		
		_Factory.baseGetAllByFilter = function(entity, filter) {
			var f = filter || '';
			return $http.get(urlBase + '/' + entity + '/filter/' + fq);
		};

		_Factory.baseGetById = function(entity, id) {
			return $http.get(urlBase + '/' + entity + '/' + id);
		};
		
		_Factory.basePost = function(entity, obj) {
			return $http.post(urlBase + '/' + entity, obj);
		};

		_Factory.basePut = function(entity, id, obj) {
			return $http.put(urlBase + '/' + entity + '/' + id, obj);
		};

		_Factory.baseDelete = function(entity, id) {
			return $http.delete(urlBase + '/' + entity + '/' + id);
		};
		
		//*************************************************
		// Metodi per UPLOAD FILE E FATTURA
		//*************************************************
		_Factory.uploadFile = function(file) {
			return $http({
            method: 'POST',
            url: urlBase + '/upload',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                upload: file
            },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }
        });	
		}

		_Factory.uploadFattura = function(file) {
			return $http({
            method: 'POST',
            url: urlBase + '/upload/fattura',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                upload: file
            },
            transformRequest: function (data, headersGetter) {
                var formData = new FormData();
                angular.forEach(data, function (value, key) {
                    formData.append(key, value);
                });

                var headers = headersGetter();
                delete headers['Content-Type'];

                return formData;
            }
        });	
		}
		
		//*************************************************
		// Metodi Preview
		//*************************************************
		_Factory.filePreview = function(id) {
			return $http.get(urlBase + '/files/' + id + '/preview');
		}

		_Factory.fatturaPreview = function(id) {
			return $http.get(urlBase + '/fatture/' + id + '/preview');
		}
		
		// --- PUBLIC METHODS -----
		_Factory.setUserReset = function(obj) {
			return $http.post(urlBase + '/public/setUserReset', obj);
		}; 

		_Factory.resetPwd = function(obj) {
			console.log('_Factory.resetPwd');
			console.dir(obj);
			
			return $http.post(urlBase + '/public/reset/password', obj);
		}; 

		_Factory.checkToken = function(obj) {
			var username 	= obj.username || '',
					pec 			= obj.pec || '',
					token			= obj.token || '';
			
			return $http.get(urlBase + '/public/reset/' 
											 + username + '/'
											 + pec + '/'
											 + token
											);
		}; 
		
		return _Factory;
	});
})();
