// app/parma/paramCtrl.js.js

(function () {
	'use strict';
	var controllerId = 'categoriaNewsCtrl';
	angular.module('app').controller(controllerId, ['dataFactory', '$modal', 'toastr', categoriaNewsCtrl]);

	function categoriaNewsCtrl(dataFactory, $modal, toastr) {
		var vm = this;
		vm.title = 'Categoria News';
		vm.elenco = [];
		vm.param = 'categorieNews';		//**** impostare nome parametro (plurale prima parola)
		
		vm.page = 1;
		vm.numRecords = 0;

		
		vm.filter = '';
		
		//Actions
		vm.delete = deleteConfirm;
		vm.new = createNew;
		vm.refresh = getPage;
		vm.save = save;
		vm.edit = edit;
		vm.cancel = cancel;

		//ACTIVATE *****************************************
		getPage();
		count();

		//****************************************************
		// METODI 
		//****************************************************
		function getPage() {
			dataFactory.baseGetPage('params/' + vm.param, vm.page).then(function (data) {
				vm.elenco = data.data;
			});
		}

		function count() {
			dataFactory.baseCount('params/' + vm.param).then(function (data) {
				vm.numRecords = data.data;
			});
		}

		function postRecord(item) {
			var index = vm.elenco.indexOf(item);
			var obj = createParam(item);
			
			dataFactory.basePost('params/' + vm.param, obj)
				.then(
					function (data) {
						vm.elenco[index] = data.data;
						vm.numRecords++;
						toastr.success('record saved');
					}, 
					function (err) {
						toastr.error(err.data.message);
					}
			);
		}

		function putRecord(item) {
			var obj = createParam(item);
			
			dataFactory.basePut('params/' + vm.param, obj._id, obj).then(function (data) {
				delete item.edit;
				toastr.success('record updated');
			});
		}

		function deleteRecord(item) {
			var index = vm.elenco.indexOf(item);
			dataFactory.baseDelete('params/' + vm.param, item._id).then(function (data) {
				vm.elenco.splice(index, 1);
				vm.numRecords--;
				toastr.success('record deleted');
			});
		}
		
		function deleteConfirm(item) {
			var strConfirm = item.nome;
			
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
			if(!item._id) postRecord(item);
			else putRecord(item);
		}
		
		function edit(item) {
			item.edit = true;
		}
		
		function cancel(item) {
			if(!item._id) {
				var index = vm.elenco.indexOf(item);
				vm.elenco.splice(index, 1);
			} else {
				delete item.edit;
			}

		}

		function createNew() {
			vm.elenco.push({edit: true});
		}
		
		function createParam(obj) {
			var item = {};
			
			for(var prop in obj) {
				if(prop!='edit') {
					item[prop] = obj[prop];
				}
			}
			
			return item;
		}
		
	}	
})();