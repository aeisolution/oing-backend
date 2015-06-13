// app/ordine/commissione/controller.js

(function () {
	'use strict';
	var controllerId = 'commissioneCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$filter', '$modal', 'toastr', commissioneCtrl]);

	function commissioneCtrl(dataFactory, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Commissioni Tecniche';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.record = {};
		vm.newRecord = false;

		vm.componenti = [];
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getElenco;
		vm.save = save;
		vm.select = select;
		vm.switchView = switchView;
		
		vm.getAlboAnag = getAlboAnag;
		
		//Azioni Ruoli
		vm.ruoliUpdate = ruoliUpdate;
		
		//Azioni su Componenti
		vm.componenteCheck = componenteCheck;		
		vm.componenteAdd = componenteAdd;
		vm.componenteDelete = componenteDelete;


		//ACTIVATE *****************************************
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll('commissioni').then(function (data) {
				vm.elenco = data.data;
				syncElencoAnag();
			});
		}
		
		function getRecord(id) {
			return dataFactory.baseGetById('commissioni', id).then(function (data) {
				vm.record = data.data;
				
				vm.newRecord = false;
				getComponenti(vm.record.componenti);
			});
		}
		
		function syncElencoAnag() {
			for(var i=0,len= vm.elenco.length;i<len;i++) {
				var item = {};
				item = vm.elenco[i];

				referenteAnag(vm.elenco[i]);
				coordinatoreAnag(vm.elenco[i]);
			}
		}
		
		function referenteAnag(item) {
			var obj = item;
			if(obj.referente) {
					getAlboAnag(obj.referente).then(function(data) {
						obj.referenteAnag = data.cognome + ' ' + data.nome;
					});
				}
		}

		function coordinatoreAnag(item) {
			var obj = item;
				if(obj.coordinatore) {
					getAlboAnag(obj.coordinatore).then(function(data) {
						obj.coordinatoreAnag = data.cognome + ' ' + data.nome;
					});
				}
		}
		
		function getAlboAnag(id, result) {
			var obj = result;
			return dataFactory.baseGetById('albo', id + '/anag')
				.then(function (data) {
					obj = data.data;
					return obj;
			});
		}

		function postRecord() {

			dataFactory.basePost('commissioni',vm.record)
				.then(
					function (data) {
						vm.elenco.push(data.data);
						vm.newRecord = false;
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
			if(vm.newRecord === true) postRecord();
			else putRecord();
		}
		
		function switchView(view) {
			vm.view = view || 'elenco';
		}
		
		function select(item) {
			getRecord(item._id).then(function(){
				vm.newRecord = false;
				switchView('record');	
			});
		}

		function createNew() {
			vm.record = {};
			vm.componenti = [];
			vm.newRecord = true;
			//componenteReset();
			switchView('record');
		}
		

		//-----------------
		// RUOLI
		function ruoliUpdate() {
			dataFactory.commissioneRuoliUpdate(vm.record._id, 
																				vm.record.referente, 
																				vm.record.coordinatore, 
																				vm.record.segretario)
				.then(function (data) {
					toastr.success('record updated');
			});
		}		
		
		//-----------------
		// CONSIGLIERI 
		function getComponenti(list) {
			vm.componenti = [];
			if(!list || list.length==0) { return; }
			
			return dataFactory.alboGetList(list)
				.then(function(data){
					vm.componenti = data.data;				
				
					for(var i=0,len=vm.componenti.length;i<len;i++) {
						vm.componenti[i].nominativo = getComponenteNominativo(vm.componenti[i]);
					}
			});
		}

		function getComponenteNominativo(cons) {
			if(!cons) { return; }
			
			return cons._id + ' - ' + cons.cognome + ' ' + cons.nome;
		}
		
		function newComponenteReset() {
			vm.newComponente = {};
		}

		function componenteCheck() {
			if(!vm.newComponente.id) {
				return;
			}
			getAlboAnag(vm.newComponente.id)
				.then(function(data){
					if(!data) {
						vm.newComponente.nominativo = '';
					} else {
						vm.newComponente.nominativo = data.cognome + ' ' + data.nome;
					}
			});
			
		}
		
		function componenteAdd() {
			dataFactory.commissioneComponenteAdd(vm.record._id, vm.newComponente.id)
				.then(function (data) {
					getAlboAnag(vm.newComponente.id)
						.then(function(data){
							var cons = {};
							
							if(data) { 
								cons = data; 
								cons.nominativo = vm.newComponente.id + ' - ' + data.cognome + ' ' + data.nome;
							}
							cons._id = vm.newComponente.id;

							vm.componenti.push(cons);
							newComponenteReset();
					});
			});			
		}
		
		function componenteDelete(item) {
			var index = vm.componenti.indexOf(item);
			
			var strConfirm = item.nominativo;
			
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
						dataFactory.commissioneComponenteDelete(vm.record._id, item._id)
							.then(function (data) {
							vm.componenti.splice(index, 1);
						});
					});
		}

	}	
})();