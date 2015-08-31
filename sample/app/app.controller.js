;(function() {
  'use strict';

  angular
    .module('sample-app')
    .controller('AppController', AppController);

  AppController.$inject = ['$rootScope', '$state'];

  function AppController($rootScope, $state){

    $rootScope.changePage = changePage;

    function changePage(){
      $state.go($rootScope.chosenPage);
    }

  }

})();
