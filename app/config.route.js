(function () {
    'use strict';

    var app = angular.module('app');

		app.config(function($routeProvider, $httpProvider) {
		
			$httpProvider.interceptors.push('TokenInterceptor');
			
			$routeProvider
				.when('/login', {
					templateUrl: '/app/auth/login.html',
					controller: 'LoginCtrl as vm',
					access: {
						requiredLogin: false
					}
				// DashBoard *****************************************
				}).when('/dashboard', {
					templateUrl: '/app/dashboard/dashboard.html',
					access: {
						requiredLogin: true
					}
				// Archivi *****************************************
				}).when('/archivio/circolari', {
					templateUrl: '/app/circolare/circolareMain.html',
					controller: 'circolareCtrl as vm',
					access: {
						requiredLogin: true
					}				
				}).when('/archivio/convenzioni', {
					templateUrl: '/app/convenzione/convenzioneMain.html',
					controller: 'convenzioneCtrl as vm',
					access: {
						requiredLogin: true
					}				
				}).when('/archivio/notizie', {
					templateUrl: '/app/notizia/notiziaMain.html',
					controller: 'notiziaCtrl as vm',
					access: {
						requiredLogin: true
					}				
				}).when('/pagine', {
					templateUrl: '/app/pagina/paginaMain.html',
					controller: 'paginaCtrl as vm',
					access: {
						requiredLogin: true
					}				
				// Ordine *****************************************
				}).when('/ordine/commissioni', {
					templateUrl: '/app/commissione/commissioneMain.html',
					controller: 'commissioneCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/ordine/consiglio/disciplina', {
					templateUrl: '/app/consiglioD/consiglioDMain.html',
					controller: 'consiglioDCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/ordine/consiglio/territoriale', {
					templateUrl: '/app/consiglioT/consiglioTMain.html',
					controller: 'consiglioTCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/albo', {
					templateUrl: '/app/ingegnere/ingegnereMain.html',
					controller: 'ingegnereCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/repository', {
					templateUrl: '/app/file/file.html',
					controller: 'fileCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/fatture', {
					templateUrl: '/app/fattura/fattura.html',
					controller: 'fatturaCtrl as vm',
					access: {
						requiredLogin: true
					}
				// parametri *****************************************
				}).when('/params/documento', {
					templateUrl: '/app/param/codiceNome.html',
					controller: 'documentoCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/params/laurea', {
					templateUrl: '/app/param/codiceNome.html',
					controller: 'laureaCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/params/ruoloCommissione', {
					templateUrl: '/app/param/codiceNome.html',
					controller: 'ruoloCommissioneCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/params/ruoloConsiglio', {
					templateUrl: '/app/param/codiceNome.html',
					controller: 'ruoloConsiglioCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/params/settore', {
					templateUrl: '/app/param/nome.html',
					controller: 'settoreCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/params/tag', {
					templateUrl: '/app/param/nome.html',
					controller: 'tagCtrl as vm',
					access: {
						requiredLogin: true
					}
				// utente *************************************************
				}).when('/profilo/utente', {
					templateUrl: '/app/account/utente.html',
					controller: 'utenteCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/account/cambioPassword', {
					templateUrl: '/app/account/cambioPassword.html',
					controller: 'cambioPasswordCtrl as vm',
					access: {
						requiredLogin: true
					}
				// admin *************************************************
				}).when('/admin/account', {
					templateUrl: '/app/admin/accountMain.html',
					controller: 'accountCtrl as vm',
					access: {
						requiredLogin: true
					}
				// default action *****************************************
				}).otherwise({
					redirectTo: '/login'
				});			

				
		});

})();