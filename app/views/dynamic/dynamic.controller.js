;(function() {
  'use strict';

  angular
    .module('sample-app')
    .controller('DynamicController', DynamicController);

  DynamicController.$inject = ['$state'];

  function DynamicController($state){

    var _this = this;

    _this.dynamicOptions = {
      sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE'],
      navigation: true,
      navigationPosition: 'right'
    };

    _this.changePosition = function(){
      if (_this.dynamicOptions.navigationPosition === 'right') {
          _this.dynamicOptions.navigationPosition = 'left';
      } else {
          _this.dynamicOptions.navigationPosition = 'right';
      }
    };

  }

})();
