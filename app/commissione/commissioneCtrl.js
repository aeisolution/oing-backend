// app/ordine/commissione/controller.js

(function () {
	'use strict';
	var controllerId = 'commissioneCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$modal', 'toastr', commissioneCtrl]);

	function commissioneCtrl(dataFactory, $modal, toastr) {
		var vm = this;
		vm.title = 'Commissioni';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.record = {};
		vm.componente = {};
		
		vm.filter = '';
		vm.fields = 'nome=1&descrizione=1&referente.nominativo=0';
		
		//Collapse
		vm.addIsCollapsed = true;
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getElenco;
		vm.save = save;
		vm.search = search;
		vm.select = select;
		vm.switchView = switchView;
		
		vm.componenteAdd = componenteAdd;
		vm.componenteDelete = componenteDelete;


		//ACTIVATE *****************************************
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll('commissioni', vm.fields).then(function (data) {
				vm.elenco = data.data;
			});
		}

		function getByFilter(filter) {
			dataFactory.baseGetAllByFilter('commissioni', filter, vm.fields).then(function (data) {
				vm.elenco = data.data;
			});
		}
		
		function getRecord(id) {
			return dataFactory.baseGetById('commissioni', id).then(function (data) {
				return data; 
			});
		}
		
		function postRecord() {
			dataFactory.basePost('commissioni',vm.record)
				.then(
					function (data) {
						vm.elenco.push(data.data);
						toastr.success('record saved');
					}, 
					function (err) {
						console.dir(err);
						toastr.error(err.data.messsage);
					}
			);
		}

		function putRecord() {
			dataFactory.basePut('commissioni', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}

		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('commissioni', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 'Commissione ' + item.nome;
			
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
		
		function search() {
			if(!vm.filter) {
				getElenco();
			} else 
				getByFilter(vm.filter);
		}
		
		function switchView(view) {
			vm.view = view || 'elenco';
		}
		
		function select(item) {
			getRecord(item._id).then(function(data){
				vm.record = data.data;
				switchView('record');	
			});
		}

		function createNew() {
			vm.record = {};
			componenteReset();
			switchView('record');
		}
		
		//-----------------
		// Azioni su Componenti
		function componenteReset() {
			vm.componente = {};
		}
		
		function componenteAdd() {
			dataFactory.postComponente(vm.record._id, vm.componente).then(function (data) {
				vm.record.componenti.push(vm.componente);
				componenteReset();
			});			
		}
		
		function componenteDelete(item) {
			var sezione = item.sezione,
					numero 	= item.numero,
					index		= vm.record.componenti.indexOf(item);
			
			dataFactory.deleteComponente(vm.record._id, sezione, numero).then(function (data) {
				vm.record.componenti.splice(index, 1);
			});
		}

	}	
})();