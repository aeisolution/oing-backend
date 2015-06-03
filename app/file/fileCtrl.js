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
		vm.new = createNew;
		vm.refresh = getElenco;
		vm.save = save;
		vm.edit = edit;
		vm.cancel = cancel;
		
		vm.sendFile = sendFile;

		//ACTIVATE *****************************************
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll('files').then(function (data) {
				vm.elenco = data.data;
			});
		}

		function getByFilter(filter) {
			dataFactory.baseGetAllByFilter('files', filter).then(function (data) {
				vm.elenco = data.data;
			});
		}
		
		function sendFile(file) {
			console.log('sendfile...');
			if(!file) {
				return toastr.warning('Select File');
			}
				
			dataFactory.uploadFile(file)
				.then(
					function (data) { 
						toastr.success('file uploaded');
						vm.elenco.push(data.data);
					},
					function (err, status) {
						console.dir(err);
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
			/*
			if(!item._id) postRecord(item);
			else putRecord(item);
			*/
		}
		
		function edit(item) {
			console.log('edit');
			item.edit = true;
		}
		
		function cancel(item) {
			delete item.edit;
		}

		function createNew() {
			vm.elenco.push({edit: true});
		}
		
		//-----------------
		// Azioni su Componenti


	}	
})();