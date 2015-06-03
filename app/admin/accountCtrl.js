// app/ingegnere/ingegnereCtrl.js

(function () {
	'use strict';
	var controllerId = 'accountCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$scope', '$filter', '$modal', 'toastr', accountCtrl]);

	function accountCtrl(dataFactory, $scope, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Elenco utenti BackOffice';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.record = {};
		
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getElenco;
		vm.save = save;
		vm.select = select;
		vm.switchView = switchView;
		

		//ACTIVATE *****************************************
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll('accounts', vm.fields).then(function (data) {
				vm.elenco = data.data;
			});
		}

		function getRecord(id) {
			return dataFactory.baseGetById('accounts', id).then(function (data) {
				vm.record = data.data;
			});
		}


		function postRecord() {
			dataFactory.basePost('accounts',vm.record)
				.then(
					function (data) {
						vm.elenco.push(data.data);
						toastr.success('record saved');
					}, 
					function (err) {
						toastr.error(err.data.message);
					}
			);
		}

		function putRecord() {
			dataFactory.basePut('accounts', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}
		
		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('accounts', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 	item.username;
			
			var modalInstance = $modal.open({
				templateUrl: 'app/common/modalConfirm.html',
				controller: 'modalConfirmCtrl as vm',
				resolve: {
					text: function () {
						return strConfirm;
					}
				}
			});

			modalInstance.result
				.then(
					function () { 
						deleteRecord(item); 
					});
			
		}
		
		function save() {
			if(!vm.record._id) postRecord();
			else putRecord();
		}
		
		function switchView(view) {
			vm.view = view || 'elenco';
		}
		
		function select(item) {
			getRecord(item._id).then(function(){
				switchView('record');	
			});
		}

		function createNew() {
			resetRecord();
			switchView('record');
		}
		
		function resetRecord() {
			vm.record = {};
		}
	
		//-----------------
		// Azioni


	}	
})();