(function () {
	'use strict';
	var controllerId = 'notiziaCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$scope', '$filter', '$modal', 'toastr', notiziaCtrl]);

	function notiziaCtrl(dataFactory, $scope, $filter, $modal, toastr) {
		var vm = this;
		vm.title = 'Notizie';
		vm.view = 'elenco';
		vm.elenco = [];
		vm.record = {};
		
		vm.filter = null;
		
		vm.opened = {
			data: false
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
		

		//ACTIVATE *****************************************
		getElenco();

		//****************************************************
		// METODI 
		//****************************************************
		function getElenco() {
			dataFactory.baseGetAll('notizie', vm.fields).then(function (data) {
				vm.elenco = data.data;
			});
		}

		function getRecord(id) {
			return dataFactory.baseGetById('notizie', id).then(function (data) {
				vm.record = data.data;
				
				setR_DateToStr(vm.record);
			});
		}


		function postRecord() {
			setR_StrToDate(vm.record);
			
			dataFactory.basePost('notizie',vm.record)
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

			dataFactory.basePut('notizie', vm.record._id, vm.record).then(function (data) {
				toastr.success('record updated');
			});
		}

		function setR_StrToDate() {
			// data
			if(vm.record.dataStr) vm.record.data = new Date(vm.record.dataStr);
			else if(data) vm.record.data = null;			
		}
		
		function setR_DateToStr() {
			var strDate = '';

			// data
			if(vm.record.data) { 
				strDate = $filter('date')(vm.record.data, 'yyyy-MM-dd', '+02:00');
				vm.record.dataStr = new Date(strDate);
			}
			else {
				vm.record.dataStr = '';
			}
		}		
		
		
		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('notizie', item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = 	item.oggetto;
			
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
		

		
	
		//-----------------
		// Azioni


	}	
})();