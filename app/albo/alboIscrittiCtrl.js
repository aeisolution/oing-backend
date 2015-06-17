// app/ingegnere/ingegnereCtrl.js

(function () {
	'use strict';
	var controllerId = 'iscrittoCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$scope', '$filter', '$modal', 'toastr', iscrittoCtrl]);

	function iscrittoCtrl(dataFactory, $scope, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Albo Iscritti';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.page = 1;
		vm.numRecords = 0;
		vm.record = {};
		vm.newRecord = false;

		
		vm.lauree = [];
		vm.abilitazioni = [];
		
		vm.filter = null;
		
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
		
		// dominio pec
		vm.setPecDomain = setPecDomain;
		
		//Sedi
		vm.sediUpdate = sediUpdate;
		
		//Lauree
		vm.selectLaurea = selectLaurea;
		vm.laureaAdd = laureaAdd;
		vm.laureaDelete = laureaDelete;
		
		//Abilitazioni
		vm.abilitazioneAdd = abilitazioneAdd;
		vm.abilitazioneDelete = abilitazioneDelete;
		
		//Iscrizioni
		vm.iscrizioneAdd = iscrizioneAdd;
		vm.iscrizioneDelete = iscrizioneDelete;
		
		//ACTIVATE *****************************************
		getPage();
		getLauree();
		getAbilitazioni();

		//****************************************************
		// METODI 
		//****************************************************
		function getAbilitazioni() {
			dataFactory.baseGetAll('params/abilitazioni').then(function (data) {
				vm.abilitazioni = data.data;
			});
		}

		function getLauree() {
			dataFactory.baseGetAll('params/lauree').then(function (data) {
				vm.lauree = data.data;
				
				if(vm.lauree.length>0) {
					for(var i=0,len=vm.lauree.length;i<len;i++) {
						vm.lauree[i].titolo = vm.lauree[i].codice + ' - ' + vm.lauree[i].nome;
					}
				}
			});
		}

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

		function getRecord(id) {
			return dataFactory.baseGetById('albo', id).then(function (data) {
				vm.record = data.data;
				
				vm.newRecord = false;
				setR_DateToStr(vm.record);
				getSettori(vm.record);
			});
		}


		function postRecord() {
			setR_StrToDate(vm.record);
			
			dataFactory.basePost('albo',vm.record)
				.then(
					function (data) {
						vm.elenco.push(data.data);
						vm.newRecord = false;						
						toastr.success('record saved');
					}, 
					function (err) {
						toastr.error(err.data.message);
					}
			);
		}

		function putRecord() {
			setR_StrToDate(vm.record);

			dataFactory.basePut('albo', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}

		function setR_StrToDate() {
			// nascData
			if(vm.record.nascDataStr) vm.record.nascData = new Date(vm.record.nascDataStr);
			else if(data) vm.record.nascData = null;
			
			// albo.iscrizione.primaData
			/*
			if(vm.record.albo.iscrizione.primaDataStr) vm.record.albo.iscrizione.primaData = new Date(vm.record.albo.iscrizione.primaDataStr);
			else if(data) vm.record.albo.iscrizione.primaData = null;

			// albo.iscrizione.data
			if(vm.record.albo.iscrizione.dataStr) vm.record.albo.iscrizione.data = new Date(vm.record.albo.iscrizione.dataStr);
			else if(data) vm.record.albo.iscrizione.data = null;			
			*/
		}
		
		function setR_DateToStr() {
			var strDate = '';

			// albo.nascData
			if(vm.record.nascData) { 
				strDate = $filter('date')(vm.record.nascData, 'yyyy-MM-dd', '+02:00');
				vm.record.nascDataStr = new Date(strDate);
			}
			else {
				vm.record.nascDataStr = '';
			}
			/*
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
			*/
		}		
		
		
		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('albo', item._id).then(function (data) {
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
			resetRecord();
			vm.newRecord = true;			
			switchView('record');
		}
		
		function resetRecord() {
			vm.record = {
				settori: []
			};
			resetSettori();
		}
		
		function setSettori() {
			var settori = [];
			
			if(vm.checkSettori.A) settori.push('A');
			if(vm.checkSettori.B)	settori.push('B');
			if(vm.checkSettori.C) settori.push('C');
			
			vm.record.settori = settori;
		}
		
		function getSettori(record) {
			resetSettori();
			
			var settori = record.settori;
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
		function setPecDomain() {
			if(!vm.record.pec) return;
			
			var pec = '';
			var at = vm.record.pec.indexOf('@');
			if(at>=0) {
				pec = vm.record.pec.substring(0, at);
			} else {
				pec = vm.record.pec.replace(' ','');
			}
			vm.record.pec = pec + '@ordineingegnerisiracusa.it';
			
		}
		
		//-----------------
		// SEDI Residenza / Ufficio
		function sediUpdate() {
			dataFactory.alboSediUpdate(vm.record._id, 
																 vm.record.resIndirizzo, 
																 vm.record.resComune, 
																 vm.record.resCap, 
																 vm.record.resTelefono, 
																 vm.record.resFax, 
																 vm.record.uffIndirizzo, 
																 vm.record.uffComune, 
																 vm.record.uffCap, 
																 vm.record.uffTelefono1, 
																 vm.record.uffTelefono2, 
																 vm.record.uffFax)
				.then(function (data) {
					toastr.success('record updated');
			});
		}
		
		//-----------------
		// LAUREE 
		function selectLaurea() {
			console.log('selectLaurea()');
			if(vm.newLaurea.classe) {
				for(var i=0,len=vm.lauree.length;i<len;i++) {
					if(vm.newLaurea.classe===vm.lauree[i].codice) {
						return newObj.descrizione = vm.lauree[i].nome;
					}
				}
			}
		}
		
		function newLaureaReset() {
			vm.newLaurea = {};
		}
		
		function laureaAdd(item) {
			var newObj = {};
			newObj.classe = item.classe;
			newObj.descrizione = item.descrizione;
			newObj.luogo = item.luogo;
			newObj.anno = item.anno;
			
			dataFactory.alboLaureaAdd(vm.record._id, newObj)
				.then(function (data) {
					console.log(data);
					newObj._id = data.data;
					vm.record.lauree.push(newObj);
					newLaureaReset();			
			});			
		}
		
		function laureaDelete(item) {
			var index = vm.record.lauree.indexOf(item);
			
			var strConfirm = item.classe + ' ' + item.descrizione;
			
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
						dataFactory.alboLaureaDelete(vm.record._id, item.classe)
							.then(function (data) {
							vm.record.lauree.splice(index, 1);
						});
					});
		}		

		//-----------------
		// ABILITAZIONI 
		function newAbilitazioneReset() {
			vm.newAbilitazione = {};
		}
		
		function abilitazioneAdd(item) {
			var newObj = {};
			newObj.tipo = item.tipo;
			newObj.luogo = item.luogo;
			newObj.anno = item.anno;
			
			dataFactory.alboAbilitazioneAdd(vm.record._id, newObj)
				.then(function (data) {
					newObj._id = data.data;
					vm.record.abilitazioni.push(newObj);
					newAbilitazioneReset();			
			});			
		}
		
		function abilitazioneDelete(item) {
			var index = vm.record.abilitazioni.indexOf(item);
			
			var strConfirm = item.tipo + ' ' + item.anno;
			
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
						dataFactory.alboAbilitazioneDelete(vm.record._id, item.anno)
							.then(function (data) {
							vm.record.abilitazioni.splice(index, 1);
						});
					});
		}		
		
		//-----------------
		// EVENTI 
		function newIscrizioneReset() {
			vm.newIscrizione = {};
		}
		
		function iscrizioneAdd(item) {
			var newObj = {};
			newObj.data = convertStrToDate(item.data);
			newObj.provincia = item.provincia;
			
			dataFactory.alboIscrizioneAdd(vm.record._id, newObj)
				.then(function (data) {
					newObj._id = data.data;
					vm.record.iscrizioni.push(newObj);
					newIscrizioneReset();			
			});			
		}
		
		function iscrizioneDelete(item) {
			var index = vm.record.iscrizioni.indexOf(item);
			
			var strConfirm = item.data + ' ' + item.provincia;
			
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
						dataFactory.alboIscrizioneDelete(vm.record._id, item._id)
							.then(function (data) {
							vm.record.iscrizioni.splice(index, 1);
						});
					});
		}
		
		//-----------------
		// Metodi per date
		function convertStrToDate(str) {
			var resultDate = null;

			if(str) {
				resultDate = new Date(str);
			}
			return resultDate;
		}		
		
	}	
})();