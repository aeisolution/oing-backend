(function () {
	'use strict';
	var controllerId = 'modalResetPwdCtrl';
	angular.module('app').controller(controllerId, ['$modalInstance', 'username', modalResetPwdCtrl]);

	function modalResetPwdCtrl($modalInstance, username) {
		var vm = this;
		vm.username = username;
		vm.password = '';
		
		vm.modalOk = function () {
			$modalInstance.close(vm.password);
		};

		vm.modalCancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
})();