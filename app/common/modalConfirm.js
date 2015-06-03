(function () {
	'use strict';
	var controllerId = 'modalConfirmCtrl';
	angular.module('app').controller(controllerId, ['$modalInstance', 'text', modalConfirmCtrl]);

	function modalConfirmCtrl($modalInstance, text) {
		var vm = this;
		vm.text = text;
		
		vm.modalOk = function () {
			$modalInstance.close('ok');
		};

		vm.modalCancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
})();