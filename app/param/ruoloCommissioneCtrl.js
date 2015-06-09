// app/ordine/commissione/controller.js

(function () {
	'use strict';
	var controllerId = 'ruoloCommissioneCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$modal', 'toastr', ruoloCommissioneCtrl]);

	function ruoloCommissioneCtrl(dataFactory, $modal, toastr) {
		var vm = this;
		vm.title = 'Ruoli Componenti Commissioni';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.componente = {};
		
		vm.page = 1;
		vm.numRecords = 0;

		
		vm.filter = '';
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getPage;
		vm.save = save;
		vm.edit = edit;
		vm.cancel = cancel;

		//ACTIVATE *****************************************
		getPage();
		count();

		//****************************************************
		// METODI 
		//****************************************************
		function getPage() {
			dataFactory.baseGetPage('params/ruoliCommissione', vm.page).then(function (data) {
				vm.elenco = data.data;
			});
		}

		function count() {
			dataFactory.baseCount('params/ruoliCommissione').then(function (data) {
				vm.numRecords = data.data;
			});
		}


		function getByFilter(filter) {
			dataFactory.baseGetAllByFilter('params/ruoliCommissione', filter).then(function (data) {
				vm.elenco = data.data;
			});
		}
		
		function postRecord(item) {
			var index = vm.elenco.indexOf(item);
			var obj = {};
			obj.codice = item.codice;
			obj.nome = item.nome;
			
			dataFactory.basePost('params/ruoliCommissione',obj)
				.then(
					function (data) {
						getPage();
						toastr.success('record saved');
					}, 
					function (err) {
						console.dir(err);
						toastr.error(err.data.message);
					}
			);
		}

		function putRecord(item) {
			var obj = {};
			obj._id = item._id;
			obj.codice = item.codice;
			obj.nome = item.nome;
			
			dataFactory.basePut('params/ruoliCommissione', item._id, obj).then(function (data) {
						getPage();
				toastr.success('record updated');
			});
		}

		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('params/ruoliCommissione', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = item.codice + ' - ' + item.nome;
			
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
		
		function save(item) {
			if(!item._id) postRecord(item);
			else putRecord(item);
		}
		
		function edit(item) {
			console.log('edit');
			item.edit = true;
		}
		
		function cancel(item) {
			if(!item._id) {
				var index = vm.elenco.indexOf(item);
				vm.elenco.splice(index, 1);
			} else {
				delete item.edit;
			}

		}

		function createNew() {
			vm.elenco.push({edit: true});
		}
		
		//-----------------
		// Azioni su Componenti


	}	
})();