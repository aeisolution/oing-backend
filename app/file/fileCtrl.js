(function () {
	'use strict';
	var controllerId = 'fileCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$modal', 'toastr', fileCtrl]);

	function fileCtrl(dataFactory, $modal, toastr) {
		var vm = this;
		vm.title = 'Repository Files';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.componente = {};
		
		vm.filter = '';
		
		//Actions
		vm.delete = deleteConfirm;
		vm.refresh = getElenco;
		vm.save = save;
		vm.edit = edit;
		vm.cancel = cancel;
		vm.preview = preview;
		
		vm.sendFile = sendFile;

		//ACTIVATE *****************************************
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll('files').then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;
			});
		}

		function getByFilter(filter) {
			dataFactory.baseGetAllByFilter('files', filter).then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;
			});
		}
		
		function sendFile(file) {
			if(!file) {
				return toastr.warning('Select File');
			}
				
			dataFactory.uploadFile(file)
				.then(
					function (data) { 
						toastr.success('file uploaded');
						vm.elenco.push(data.data);
						vm.file = '';
					},
					function (err, status) {
						toastr.error('ERROR upload');
        }
			);
		}
		/*
		function postRecord(item) {
			var index = vm.elenco.indexOf(item);
			
			dataFactory.basePost('files',item)
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
		*/

		function putRecord(item) {
			dataFactory.basePut('files', item._id, item).then(function (data) {
				delete item.edit;
				toastr.success('record updated');
			});
		}

		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('files', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
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
						deleteRecord(item); 
					});
			
		}
		
		function save(item) {
			if(item._id) {
				putRecord(item);
			}
		}
		
		function edit(item) {
			item.edit = true;
		}
		
		function cancel(item) {
			delete item.edit;
		}

		function preview(item) {
			dataFactory.filePreview(item._id).then(function (data) {
				toastr.success('download avviato..');
			});
		}

		
		
		//-----------------
		// Azioni su Componenti


	}	
})();