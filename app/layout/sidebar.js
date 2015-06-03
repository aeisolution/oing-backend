(function () {
    'use strict';

    var controllerId = 'sidebarCtrl';
    angular.module('app').controller(controllerId,
        ['$route', sidebarCtrl]);

    function sidebarCtrl($route) {
        var vm = this;

        vm.subCharts = false;
        vm.subUIElements = false;
        vm.subSamplePages = false;


    };
})();
