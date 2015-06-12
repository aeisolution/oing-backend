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
		
		// --------------------------------------------------
		// --- ALBO -----
		// Restituisce lista di soli campi base di anagrafica 
		// a partire da array di ID
		_Factory.alboGetList = function(list) {
			var obj = {};
			obj.list = list;
			
			return $http.post(urlBase + '/albo/anag', obj);
		};
	
		// --------------------------------------------------
		// --- Consiglio Territoriale/Disciplina -----
		_Factory.consiglioConsigliereAdd = function(tipo, consiglioId, ingegnereId) {
			return $http.post(urlBase + '/consigli/' + tipo + '/' + consiglioId + '/cons/' + ingegnereId,{});
		};

		_Factory.consiglioConsigliereDelete = function(tipo, consiglioId, ingegnereId) {
			return $http.delete(urlBase + '/consigli/' + tipo + '/' + consiglioId + '/cons/' + ingegnereId);
		};
		
		_Factory.consiglioEventoAdd = function(tipo, consiglioId, evento) {
			return $http.post(urlBase + '/consigli/' + tipo + '/' + consiglioId + '/eventi', evento);
		};

		_Factory.consiglioEventoDelete = function(tipo, consiglioId, eventoId) {
			return $http.delete(urlBase + '/consigli/' + tipo + '/' + consiglioId + '/eventi/' + eventoId);
		};

		// --- Consiglio solo Territoriale -----
		_Factory.consiglioTRuoliUpdate = function(consiglioId, presidente, vicepresidente, segretario, tesoriere, consulta) {
			var obj = {};
			obj.presidente = presidente;
			obj.vicepresidente = vicepresidente;
			obj.segretario = segretario;
			obj.tesoriere = tesoriere;
			obj.consulta = consulta;
			return $http.put(urlBase + '/consigli/territorio/' + consiglioId + '/ruoli', obj);
		};
		
		// --- Consiglio solo Disciplina -----
		_Factory.consiglioDRuoliUpdate = function(consiglioId, presidente, segretario) {
			var obj = {};
			obj.presidente = presidente;
			obj.segretario = segretario;
			return $http.put(urlBase + '/consigli/disciplina/' + consiglioId + '/ruoli', obj);
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
