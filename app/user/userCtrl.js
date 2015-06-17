// app/ingegnere/ingegnereCtrl.js

(function () {
	'use strict';
	var controllerId = 'userCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$scope', '$filter', '$modal', 'toastr', userCtrl]);

	function userCtrl(dataFactory, $scope, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Elenco Account Utenti';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.page = 1;
		vm.numRecords = 0;
		vm.record = {};
		vm.newRecord = false;
		
		
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getPage;
		vm.save = save;
		vm.select = select;
		vm.switchView = switchView;
		vm.confirmResetPwd = confirmResetPwd;
		

		//ACTIVATE *****************************************
		getPage();

		//****************************************************
		// METODI 
		//****************************************************
		function getPage() {
			dataFactory.baseGetPage('accounts', vm.page).then(function (data) {
				vm.elenco = data.data.list;
				vm.numRecords = data.data.pager.count;
			});
		}

		function getRecord(id) {
			return dataFactory.baseGetById('accounts', id).then(function (data) {
				vm.record = data.data;	
				vm.newRecord = false;
			});
		}

		function resetPassword(obj) {
			dataFactory.resetPassword(obj)
				.then(
					function (data) {
						toastr.success('Password modificata');
					}, 
					function (err) {
						toastr.error(err.data.message);
					}
			);
		}		

		function postRecord() {
			dataFactory.basePost('accounts',vm.record)
				.then(
					function (data) {
						getPage();
						switchView();
						vm.newRecord = false;	
						toastr.success('record saved');
					}, 
					function (err) {
						toastr.error(err.data.message);
					}
			);
		}

		function putRecord() {
			dataFactory.basePut('accounts', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}
	
		
		
		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('accounts', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 	item._id;
			
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
			vm.record = {};
		}
		
		function confirmResetPwd() {
			if(vm.newRecord) return;
			
			var modalInstance = $modal.open({
				templateUrl: 'app/user/modalResetPwd.html',
				controller: 'modalResetPwdCtrl as vm',
				resolve: {
					username: function () {
						return vm.record._id;
					}
				}
			});

			modalInstance.result
				.then(
					function (pwd) { 
						var obj = {};
						obj.username = vm.record._id;
						obj.password = pwd;
						resetPassword(obj); 
					});
			
		}
		
	}	
})();