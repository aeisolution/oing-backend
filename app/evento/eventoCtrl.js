// app/ingegnere/ingegnereCtrl.js

(function () {
	'use strict';
	var controllerId = 'eventoCtrl';
	angular.module('app').controller(controllerId, ['webconfig', 'dataFactory', '$window', '$scope', '$filter', '$modal', 'toastr', eventoCtrl]);

	function eventoCtrl(webconfig, dataFactory, $window, $scope, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Eventi Formativi';
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
		

		//ACTIVATE *****************************************
		getPage();

		//****************************************************
		// METODI 
		//****************************************************
		function getPage() {
			dataFactory.baseGetPage('eventi', vm.page).then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;
			});
		}

		function count() {
			dataFactory.baseCount('eventi').then(function (data) {
				vm.numRecords = data.data;
			});
		}
		

		function getRecord(id) {
			return dataFactory.baseGetById('eventi', id).then(function (data) {
				vm.record = data.data;	
				
				vm.newRecord = false;
			});
		}


		function postRecord() {
			console.log('record to post');
			console.log(vm.record);
			
			dataFactory.basePost('eventi',vm.record)
				.then(
					function (data) {
						getPage();
						vm.newRecord = false;												
						switchView();
						toastr.success('record saved');
					}, 
					function (err) {
						toastr.error(err.data.message);
					}
			);
		}

		function putRecord() {
			dataFactory.basePut('eventi', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}
	
		
		
		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('eventi', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 	item._id + ' - ' + 
												item.titolo;
			
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
			if(vm.newRecord===true) postRecord();
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
			vm.record = {};
		}
		
	}	
})();