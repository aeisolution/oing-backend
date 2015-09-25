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
					controller: 'dashboardCtrl as vm',
					access: {
						requiredLogin: true
					}
				// Archivi *****************************************			
				}).when('/moduli', {
					templateUrl: '/app/modulo/moduloMain.html',
					controller: 'moduloCtrl as vm',
					access: {
						requiredLogin: true
					}				
				}).when('/news', {
					templateUrl: '/app/news/newsMain.html',
					controller: 'newsCtrl as vm',
					access: {
						requiredLogin: true
					}				
				}).when('/pagine', {
					templateUrl: '/app/pagina/paginaMain.html',
					controller: 'paginaCtrl as vm',
					access: {
						requiredLogin: true
					}				
				}).when('/trasparenza', {
					templateUrl: '/app/trasparenza/trasparenzaMain.html',
					controller: 'trasparenzaCtrl as vm',
					access: {
						requiredLogin: true
					}				
				}).when('/eventi', {
					templateUrl: '/app/evento/eventoMain.html',
					controller: 'eventoCtrl as vm',
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
					templateUrl: '/app/albo/alboIscrittiMain.html',
					controller: 'iscrittoCtrl as vm',
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
				}).when('/users', {
					templateUrl: '/app/user/userMain.html',
					controller: 'userCtrl as vm',
					access: {
						requiredLogin: true
					}				
				// parametri *****************************************
				}).when('/params/abilitazione', {
					templateUrl: '/app/param/nome.html',
					controller: 'abilitazioneCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/params/categoriaEvento', {
					templateUrl: '/app/param/nome.html',
					controller: 'categoriaEventoCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/params/categoriaNews', {
					templateUrl: '/app/param/nome.html',
					controller: 'categoriaNewsCtrl as vm',
					access: {
						requiredLogin: true
					}
				}).when('/params/categoriaPagina', {
					templateUrl: '/app/param/nome.html',
					controller: 'categoriaPaginaCtrl as vm',
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