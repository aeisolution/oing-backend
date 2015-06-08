// app/ingegnere/ingegnereCtrl.js

(function () {
	'use strict';
	var controllerId = 'ingegnereCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$scope', '$filter', '$modal', 'toastr', ingegnereCtrl]);

	function ingegnereCtrl(dataFactory, $scope, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Albo Ingegneri';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.page = 1;
		vm.numRecords = 0;
		vm.record = {};
		
		vm.lauree = [];
		
		vm.filter = null;
		vm.fields =  'nome=1&cognome=1&codiceFiscale=1&albo.numero=1&albo.sezione=1&albo.iscrizione.stato=1';
		
		vm.checkSettori = {};
		
		vm.opened = {
			data: false,
			primaData: false,
			nascita: false,
			laurea: false
		};
		vm.open = function(elem, $event) {
    	$event.preventDefault();
    	$event.stopPropagation();

    	vm.opened[elem] = true;
  	};
	
		
		vm.setSettori = setSettori;
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getPage;
		vm.save = save;
		vm.select = select;
		vm.switchView = switchView;
		

		//ACTIVATE *****************************************
		getPage();
		count();
		getLauree();

		//****************************************************
		// METODI 
		//****************************************************
		function getLauree() {
			dataFactory.baseGetAll('params/laurea').then(function (data) {
				vm.lauree = data.data;
			});
		}
		
		function getPage() {
			dataFactory.baseGetPage('ingegneri', vm.page).then(function (data) {
				vm.elenco = data.data;
			});
		}

		function count() {
			dataFactory.baseCount('ingegneri').then(function (data) {
				vm.numRecords = data.data;
			});
		}
		

		function getRecord(id) {
			return dataFactory.baseGetById('ingegneri', id).then(function (data) {
				vm.record = data.data;
				
				setR_DateToStr(vm.record);
				getSettori(vm.record);
			});
		}


		function postRecord() {
			setR_StrToDate(vm.record);
			
			dataFactory.basePost('ingegneri',vm.record)
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
			setR_StrToDate(vm.record);

			dataFactory.basePut('ingegneri', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}

		function setR_StrToDate() {
			// albo.iscrizione.primaData
			if(vm.record.albo.iscrizione.primaDataStr) vm.record.albo.iscrizione.primaData = new Date(vm.record.albo.iscrizione.primaDataStr);
			else if(data) vm.record.albo.iscrizione.primaData = null;

			// albo.iscrizione.data
			if(vm.record.albo.iscrizione.dataStr) vm.record.albo.iscrizione.data = new Date(vm.record.albo.iscrizione.dataStr);
			else if(data) vm.record.albo.iscrizione.data = null;			
		}
		
		function setR_DateToStr() {
			var strDate = '';
			// albo.iscrizione.primaData
			if(vm.record.albo.iscrizione.primaData) { 
				strDate = $filter('date')(vm.record.albo.iscrizione.primaData, 'yyyy-MM-dd', '+02:00');
				vm.record.albo.iscrizione.primaDataStr = new Date(strDate);
			}
			else {
				vm.record.albo.iscrizione.primaDataStr = '';
			}

			// albo.iscrizione.data
			if(vm.record.albo.iscrizione.data) { 
				strDate = $filter('date')(vm.record.albo.iscrizione.data, 'yyyy-MM-dd', '+02:00');
				vm.record.albo.iscrizione.dataStr = new Date(strDate);
			}
			else {
				vm.record.albo.iscrizione.dataStr = '';
			}
		}		
		
		
		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('ingegneri', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 	item.nome + ' ' + 
												item.cognome + ' ' + 
												item.albo.numero + '/' + 
												item.albo.sezione;
			
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
			vm.record = {
				albo: {
					iscrizione: {
						settori: []
					}
				}
			};
			resetSettori();
		}
		
		function setSettori() {
			var settori = [];
			
			if(vm.checkSettori.A) settori.push('A');
			if(vm.checkSettori.B)	settori.push('B');
			if(vm.checkSettori.C) settori.push('C');
			
			vm.record.albo.iscrizione.settori = settori;
		}
		
		function getSettori(record) {
			if(!record || !record.albo || !record.albo.iscrizione || !record.albo.iscrizione.settori) {
				return;
			}
			resetSettori();
			
			var settori = record.albo.iscrizione.settori;
			for(var i=0,len=settori.length;i<len;i++) {
				vm.checkSettori[settori[i]] = true;
			}
		}
		
		function resetSettori() {
			vm.checkSettori.A = false;
			vm.checkSettori.B = false;
			vm.checkSettori.C = false;
		}
		
	
		//-----------------
		// Azioni


	}	
})();