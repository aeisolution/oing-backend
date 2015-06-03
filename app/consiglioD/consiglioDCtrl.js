// app/ordine/commissione/controller.js

(function () {
	'use strict';
	var controllerId = 'consiglioDCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$filter', '$modal', 'toastr', consiglioDCtrl]);

	function consiglioDCtrl(dataFactory, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Consiglio di Disciplina';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.record = {};
		vm.componente = {};
		vm.collegio = {};
		
		vm.ruoli = [];
		
		vm.opened = {
			nomina: false,
			insediamento: false
		};
		vm.open = function(elem, $event) {
    	$event.preventDefault();
    	$event.stopPropagation();

    	vm.opened[elem] = true;
  	};
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getElenco;
		vm.save = save;
		vm.select = select;
		vm.switchView = switchView;
		
		vm.componenteAdd = componenteAdd;
		vm.componenteDelete = componenteDelete;

		vm.collegioAdd = collegioAdd;
		vm.collegioDelete = collegioDelete;

		

		//ACTIVATE *****************************************
		getElenco();
		getRuoli();

		//****************************************************
		// METODI 
		//****************************************************
		function getRuoli() {
			dataFactory.baseGetAll('params/ruoloConsiglio').then(function (data) {
				vm.ruoli = data.data;
			});
		}

		function getElenco() {
			dataFactory.baseGetAll('consiglio/disciplina').then(function (data) {
				vm.elenco = data.data;
			});
		}
		
		function getRecord(id) {
			return dataFactory.baseGetById('consiglio/disciplina', id).then(function (data) {
				vm.record = data.data;
				
				setR_DateToStr(vm.record);
			});
		}

		function postRecord() {
			setR_StrToDate(vm.record);

			dataFactory.basePost('consiglio/disciplina',vm.record)
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
			setR_StrToDate(vm.record);

			dataFactory.basePut('consiglio/disciplina', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}

		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('consiglio/disciplina', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 'Consiglio Territoriale ' + item.periodo.inizio + '-' + item.periodo.fine;
			
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
			vm.record = {};
			componenteReset();
			switchView('record');
		}
		
		//-----------------
		// Metodi per date
		function setR_StrToDate() {
			// consiglio.nomina
			if(vm.record.nominaStr) vm.record.nomina = new Date(vm.record.nominaStr);
			else if(data) vm.record.nomina = null;

			// consiglio.insediamento
			if(vm.record.insediamentoStr) vm.record.insediamento = new Date(vm.record.insediamentoStr);
			else if(data) vm.record.insediamento = null;
		}
		
		function setR_DateToStr() {
			var strDate = '';
			// consiglio.nomina
			if(vm.record.nomina) { 
				strDate = $filter('date')(vm.record.nomina, 'yyyy-MM-dd', '+02:00');
				vm.record.nominaStr = new Date(strDate);
			}
			else {
				vm.record.nominaStr = '';
			}

			// consiglio.insediamento
			if(vm.record.insediamento) { 
				strDate = $filter('date')(vm.record.insediamento, 'yyyy-MM-dd', '+02:00');
				vm.record.insediamentoStr = new Date(strDate);
			}
			else {
				vm.record.insediamentoStr = '';
			}
		}			
		
		
		//-----------------
		// Azioni
		function componenteReset() {
			vm.componente = {};
		}
		
		function componenteAdd() {
			dataFactory.postConsigliereD(vm.record._id, vm.componente).then(function (data) {
				vm.record.componenti.push(vm.componente);
				componenteReset();
			});			
		}
		
		function componenteDelete(item) {
			var sezione = item.sezione,
					numero 	= item.numero,
					index		= vm.record.componenti.indexOf(item);
			
			var strConfirm = item.nominativo + ' ' + item.ruolo;
			
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
						dataFactory.deleteConsigliereD(vm.record._id, sezione, numero).then(function (data) {
							vm.record.componenti.splice(index, 1);
						});
					});
		}

		//Collegio
		function collegioReset() {
			vm.collegio = {};
		}
		
		function collegioAdd() {
			dataFactory.postCollegio(vm.record._id, vm.collegio).then(function (data) {
				vm.record.collegi.push(vm.collegio);
				componenteReset();
			});			
		}
		
		function collegioDelete(item) {
			var numero 	= item.numero;
					index		= vm.record.componenti.indexOf(item);
			
			
			var strConfirm = 'Collegio N. ' + item.numero;
			
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
						dataFactory.deleteCollegio(vm.record._id, numero).then(function (data) {
							vm.record.collegi.splice(index, 1);
						});
					});			
		}
		
		
	}	
})();