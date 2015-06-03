(function () {
	'use strict';
	var controllerId = 'fatturaCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$window', '$modal', 'toastr', fatturaCtrl]);

	function fatturaCtrl(dataFactory, $window, $modal, toastr) {		
		var vm = this;
		
		var urlBase = 'http://127.0.0.1:3000';
		
		vm.title = 'Repository Fatture Elettroniche';
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
		vm.preview = preview;
		
		vm.sendFile = sendFile;

		//ACTIVATE *****************************************
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll('fatture').then(function (data) {
				vm.elenco = data.data;
			});
		}

		function sendFile(file) {
			if(!file) {
				return toastr.warning('Select File');
			}
				
			dataFactory.uploadFattura(file)
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

		function putRecord(item) {
			dataFactory.basePut('fatture', item._id, item).then(function (data) {
				delete item.edit;
				toastr.success('record updated');
			});
		}

		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('fatture', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 'Fattura ' + item.titolo;
			
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
		
		function preview(item) {
			$window.open(urlBase + '/fattura/' + item._id + "/preview","_blank");
		}
		
		//-----------------
		// Azioni su Componenti


	}	
})();