// app/ingegnere/ingegnereCtrl.js

(function () {
	'use strict';
	var controllerId = 'paginaCtrl';
	angular.module('app').controller(controllerId, ['webconfig', 'dataFactory', '$window', '$scope', '$filter', '$modal', 'toastr', paginaCtrl]);

	function paginaCtrl(webconfig, dataFactory, $window, $scope, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Pagine Web';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.page = 1;
		vm.numRecords = 0;
		vm.record = {};
		
		vm.categorie = [];
		
		vm.filter = null;
		
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getPage;
		vm.save = save;
		vm.select = select;
		vm.switchView = switchView;
		
		// Gestione allegati
		vm.sendFile = sendFile;
		
		vm.allegatoEdit = allegatoEdit;
		vm.allegatoPreview = allegatoPreview;
		vm.allegatoSave = allegatoSave;
		vm.allegatoDelete = allegatoDelete;

		//ACTIVATE *****************************************
		getCategorie();
		getPage();

		//****************************************************
		// METODI 
		//****************************************************
		function getCategorie() {
			dataFactory.baseGetAll('params/categoriePagina').then(function (data) {
				vm.categorie = data.data.list;
			});
		}

		function getPage() {
			dataFactory.baseGetPage('pagine', vm.page).then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;
			});
		}

		function count() {
			dataFactory.baseCount('pagine').then(function (data) {
				vm.numRecords = data.data;
			});
		}
		

		function getRecord(id) {
			return dataFactory.baseGetById('pagine', id).then(function (data) {
				vm.record = data.data;				
			});
		}


		function postRecord() {
			console.log('record to post');
			console.log(vm.record);
			
			dataFactory.basePost('pagine',vm.record)
				.then(
					function (data) {
						getPage();
						switchView();
						toastr.success('record saved');
					}, 
					function (err) {
						toastr.error(err.data.message);
					}
			);
		}

		function putRecord() {
			dataFactory.basePut('pagine', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}
	
		
		
		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('pagine', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 	item.titolo + ' - ' + 
												item.dtInsert;
			
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
		
	//ALLEGATI
		function sendFile(file) {
			if(!file) {
				return toastr.warning('Select File');
			}
				
			dataFactory.uploadAllegato('pagine', vm.record._id, file)
				.then(
					function (data) { 
						toastr.success('file uploaded');
						if(!vm.record.allegati) {
							vm.record.allegati = [];
						}
						vm.record.allegati.push(data.data);
						vm.file = '';
					},
					function (err, status) {
						toastr.error('ERROR upload');
        }
			);
		}		

		function allegatoEdit(item) {
			item.edit = true;
		}
		
		function allegatoCancel(item) {
			delete item.edit;
		}
		
		function allegatoSave(item) {
			dataFactory.baseAllegatiPut('pagine', vm.record._id, item)
				.then(					
					function (data) { 
						toastr.success('updated');
						delete item.edit;
					},
					function (err, status) {
						toastr.error('ERROR update');
        }
			);
		}
		
		function allegatoDelete(item) {
			var index = vm.record.allegati.indexOf(item);
			
			var strConfirm = item.titolo;
			
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
						dataFactory.baseAllegatiDelete('pagine', vm.record._id, item.id)
							.then(					
								function (data) { 
									vm.record.allegati.splice(index, 1);
									toastr.success('deleted');
								}
						);
					});
			
		}
		
		function allegatoPreview(item) {
			$window.open(webconfig.download  + '/' + item.id,"_blank");
		}			
		
	}	
})();