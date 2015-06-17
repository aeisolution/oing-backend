// app/ingegnere/ingegnereCtrl.js

(function () {
	'use strict';
	var controllerId = 'dashboardCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', dashboardCtrl]);

	function dashboardCtrl(dataFactory) {
		var vm = this;
		vm.title = 'Dashboard';
		vm.counts = {};

		//ACTIVATE *****************************************
		getCounts();

		//****************************************************
		// METODI 
		//****************************************************
		function getCounts() {
			count('albo').then(function(result){
				vm.counts.albo = result;
			});

			count('news').then(function(result){
				vm.counts.news = result;
			});

			count('commissioni').then(function(result){
				vm.counts.commissioni = result;
			});
		}
		
		function count(entities) {
			return dataFactory.baseCount(entities).then(function (data) {
				return data.data;
			});
		}	
	}	
})();