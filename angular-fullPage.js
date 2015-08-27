;(function() {
  'use strict';

  angular
    .module('ngfullPage.js')
    .directive('fullPage', fullPage);

  fullPage.$inject = ['$timeout', '$window'];

  function fullPage($timeout, $window) {
    var directive = {
      restrict: 'A',
      scope: {options: '='},
      link: link
    };

    return directive;

    function link(scope, element, attrs) {
      var promise;

      var createFullPage = function() {
        promise = $timeout(function() {
          angular.element(element).fullpage(sanatizeOptions(scope.options));
        }, 1);
      };

      var destroyFullPage = function(callback) {
        if (promise) $timeout.cancel(promise);

        if ($.fn.fullpage.destroy) {
          $.fn.fullpage.destroy('all');
        }

        if (callback && typeof callback === 'function') callback();
      };

      var sanatizeOptions = function(options) {

        if (options && options.navigation) {
          options.afterRender = function() {
            $("#fp-nav").find("a").removeAttr("href");
          };
        }

        return options;
      };

      scope.$watch('options', function(newOptions) {
        destroyFullPage(createFullPage);
      }, true);

      element.on('$destroy', destroyFullPage);
    }
  }

})();
