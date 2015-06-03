// app/ordine/commissione/controller.js

(function () {
	'use strict';
	var controllerId = 'ruoloConsiglioCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$modal', 'toastr', ruoloConsiglioCtrl]);

	function ruoloConsiglioCtrl(dataFactory, $modal, toastr) {
		var vm = this;
		vm.title = 'Ruoli Consiglio Territoriale/Disciplina';
		vm.url = 'params/ruoloConsiglio'
		vm.view = 'elenco';
		vm.elenco = [];
		vm.componente = {};
		
		vm.filter = '';
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getElenco;
		vm.save = save;
		vm.edit = edit;
		vm.cancel = cancel;

		//ACTIVATE *****************************************
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll(vm.url).then(function (data) {
				vm.elenco = data.data;
			});
		}

		function getByFilter(filter) {
			dataFactory.baseGetAllByFilter(vm.url, filter).then(function (data) {
				vm.elenco = data.data;
			});
		}
		
		function postRecord(item) {
			var index = vm.elenco.indexOf(item);
			
			dataFactory.basePost(vm.url,item)
				.then(
					function (data) {
						vm.elenco.splice(index, 1);
						vm.elenco.push(data.data);
						toastr.success('record saved');
					}, 
					function (err) {
						console.dir(err);
						toastr.error(err.data.message);
					}
			);
		}

		function putRecord(item) {
			dataFactory.basePut(vm.url, item._id, item).then(function (data) {
				delete item.edit;
				toastr.success('record updated');
			});
		}

		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete(vm.url, item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 'Laurea ' + item.codice + ' - ' + item.titolo;
			
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