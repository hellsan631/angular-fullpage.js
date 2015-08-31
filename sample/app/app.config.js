;(function() {
  'use strict';

  angular
    .module('sample-app')
    .config(AppConfig);

  AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function AppConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state({
        name: 'main',
        url: '/main',
        templateUrl: 'app/views/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state({
        name: 'dynamic',
        url: '/dynamic',
        templateUrl: 'app/views/dynamic/dynamic.html',
        controller: 'DynamicController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('main');

  }

})();
