// app/ordine/commissione/controller.js

(function () {
	'use strict';
	var controllerId = 'consiglioTCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$filter', '$modal', 'toastr', consiglioTCtrl]);

	function consiglioTCtrl(dataFactory, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Consiglio Territoriale';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.record = {};
		vm.newRecord = false;

		vm.consiglieri = [];
		vm.categorie = [];
		
		
		vm.opened = {
			newEvent: false
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
		
		vm.getAlboAnag = getAlboAnag;
		
		//Azioni Ruoli
		vm.ruoliUpdate = ruoliUpdate;
		
		//Azioni su Consiglieri
		vm.alboSelect = selectAlbo;		
		vm.consigliereCheck = consigliereCheck;		
		vm.consigliereAdd = consigliereAdd;
		vm.consigliereDelete = consigliereDelete;

		//Azioni su Eventi
		vm.eventoAdd = eventoAdd;
		vm.eventoDelete = eventoDelete;

		//ACTIVATE *****************************************
		getCategorie();
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll('consigli/territorio').then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;

				syncElencoAnag();
			});
		}
		
		function getCategorie() {
			dataFactory.baseGetAll('params/categorieEvento').then(function (data) {
				vm.categorie = data.data;
			});
		}
		
		function getRecord(id) {
			return dataFactory.baseGetById('consigli/territorio', id).then(function (data) {
				vm.record = data.data;
				
				vm.newRecord = false;
				getConsiglieri(vm.record.consiglieri);
				//setR_DateToStr(vm.record);
			});
		}
		
		function syncElencoAnag() {
			for(var i=0,len= vm.elenco.length;i<len;i++) {
				var item = {};
				item = vm.elenco[i];

				presidenteAnag(vm.elenco[i]);
				segretarioAnag(vm.elenco[i]);
			}
		}
		
		function presidenteAnag(item) {
			var obj = item;
			if(obj.presidente) {
					getAlboAnag(obj.presidente).then(function(data) {
						obj.presidenteAnag = data.cognome + ' ' + data.nome;
					});
				}
		}

		function segretarioAnag(item) {
			var obj = item;
				if(obj.segretario) {
					getAlboAnag(obj.segretario).then(function(data) {
						obj.segretarioAnag = data.cognome + ' ' + data.nome;
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
			//setR_StrToDate(vm.record);

			dataFactory.basePost('consigli/territorio',vm.record)
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
			//setR_StrToDate(vm.record);

			dataFactory.basePut('consigli/territorio', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}

		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('consigli/territorio', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 'Consiglio Territoriale ' + item._id;
			
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
			vm.consiglieri = [];
			vm.newRecord = true;
			//componenteReset();
			switchView('record');
		}
		

		//-----------------
		// RUOLI
		function ruoliUpdate() {
			dataFactory.consiglioTRuoliUpdate(vm.record._id, 
																				vm.record.presidente, 
																				vm.record.vicepresidente, 
																				vm.record.segretario, 
																				vm.record.tesoriere, 
																				vm.record.consulta)
				.then(function (data) {
					toastr.success('record updated');
			});
		}		
		
		//-----------------
		// CONSIGLIERI 
		function getConsiglieri(list) {
			vm.consiglieri = [];
			if(!list || list.length==0) { return; }
			
			return dataFactory.alboGetList(list)
				.then(function(data){
					vm.consiglieri = data.data;				
				
					for(var i=0,len=vm.consiglieri.length;i<len;i++) {
						vm.consiglieri[i].nominativo = getConsigliereNominativo(vm.consiglieri[i]);
					}
			});
		}

		function getConsigliereNominativo(cons) {
			if(!cons) { return; }
			
			return cons._id + ' - ' + cons.cognome + ' ' + cons.nome;
		}
		
		function newConsigliereReset() {
			vm.newConsigliere = {};
		}

		function consigliereCheck() {
			if(!vm.newConsigliere.id) {
				return;
			}
			getAlboAnag(vm.newConsigliere.id)
				.then(function(data){
					if(!data) {
						vm.newConsigliere.nominativo = '';
					} else {
						vm.newConsigliere.nominativo = data.cognome + ' ' + data.nome;
					}
			});
			
		}
		
		function selectAlbo() {
			
			var modalInstance = $modal.open({
				templateUrl: 'app/common/modalSelectAlbo.html',
				controller: 'selectAlboCtrl as vm',
				resolve: {
					filter: function () {
						return '';
					}
				}
			});

			modalInstance.result
				.then(
					function (numero) { 
						if(!numero) {
							return toastr.error('Nessuna selezione');
						}
						consigliereAdd(numero);
					});
			
		}		
		
		function consigliereAdd(numeroAlbo) {
			dataFactory.consiglioConsigliereAdd('territorio', vm.record._id, numeroAlbo)
				.then(function (data) {
					getAlboAnag(numeroAlbo)
						.then(function(data){
							var cons = {};
							
							if(data) { 
								cons = data; 
								cons.nominativo = numeroAlbo + ' - ' + data.cognome + ' ' + data.nome;
							}
							cons._id = numeroAlbo;

							vm.consiglieri.push(cons);
							newConsigliereReset();
					});
			});			
		}
		
		function consigliereDelete(item) {
			var index = vm.consiglieri.indexOf(item);
			
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
						dataFactory.consiglioConsigliereDelete('territorio', vm.record._id, item._id)
							.then(function (data) {
							vm.consiglieri.splice(index, 1);
						});
					});
		}

		//-----------------
		// EVENTI 
		function newEventoReset() {
			vm.newEvento = {};
		}
		
		function eventoAdd(item) {
			var newObj = {};
			newObj.data = convertStrToDate(item.data);
			newObj.categoria = item.categoria;
			newObj.note = item.note;
			
			dataFactory.consiglioEventoAdd('territorio', vm.record._id, newObj)
				.then(function (data) {
					console.log(data);
					newObj._id = data.data;
					vm.record.eventi.push(newObj);
					newEventoReset();			
			});			
		}
		
		function eventoDelete(item) {
			var index = vm.record.eventi.indexOf(item);
			
			var strConfirm = item.data + ' ' + item.categoria;
			
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
						dataFactory.consiglioEventoDelete('territorio', vm.record._id, item._id)
							.then(function (data) {
							vm.record.eventi.splice(index, 1);
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