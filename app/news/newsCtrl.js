// app/ingegnere/ingegnereCtrl.js

(function () {
	'use strict';
	var controllerId = 'newsCtrl';
	angular.module('app').controller(controllerId, ['webconfig', 'dataFactory', '$window', '$scope', '$filter', '$modal', 'toastr', newsCtrl]);

	function newsCtrl(webconfig, dataFactory, $window, $scope, $filter, $modal, toastr) {
		var vm = this;
		
		var urlBase = webconfig.download;
		
		vm.title = 'News';
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
			dataFactory.baseGetAll('params/categorieNews').then(function (data) {
				vm.categorie = data.data.list;
			});
		}
		function getPage() {
			dataFactory.baseGetPage('news', vm.page).then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;
			});
		}

		function getRecord(id) {
			return dataFactory.baseGetById('news', id).then(function (data) {
				vm.record = data.data;				
			});
		}


		function postRecord() {
			console.log('record to post');
			console.log(vm.record);
			
			dataFactory.basePost('news',vm.record)
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
			dataFactory.basePut('news', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}
	
		
		
		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('news', item._id).then(function (data) {
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
				
			dataFactory.uploadAllegato('news', vm.record._id, file)
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
			dataFactory.baseAllegatiPut('news', vm.record._id, item)
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
						dataFactory.baseAllegatiDelete('news', vm.record._id, item.id)
							.then(					
								function (data) { 
									vm.record.allegati.splice(index, 1);
									toastr.success('deleted');
								}
						);
					});
			
		}
		
		function allegatoPreview(item) {
			$window.open(urlBase  + '/' + item.id,"_blank");
		}
		
		
	}	
})();