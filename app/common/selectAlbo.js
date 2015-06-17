(function () {
	'use strict';
	var controllerId = 'selectAlboCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$modalInstance', 'filter', selectAlboCtrl]);

	function selectAlboCtrl(dataFactory, $modalInstance, filter) {
		var vm = this;
		vm.elenco = [];
		vm.page = 1;
		vm.numRecords = 0;
		
		vm.filter = filter;

		vm.refresh = getPage;

		
		vm.select = function (item) {
			$modalInstance.close(item._id);
		};

		vm.modalCancel = function () {
			$modalInstance.dismiss('cancel');
		};
		
		// **********************************************
		// Init Elenco
		getPage();
		
		// **********************************************
		// Metodi
		function getPageFilter() {
			var filter = { cognome: vm.filter };
			
			dataFactory.baseGetPageFilter('albo', vm.page, filter).then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;
			});
		}
		
		function getPage() {
			if(vm.filter) {
				return getPageFilter();
			}

			dataFactory.baseGetPage('albo', vm.page).then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;
			});
		}

	}
})();