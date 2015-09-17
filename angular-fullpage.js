;(function() {
  'use strict';

  angular
    .module('fullPage.js', [])
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

      var rebuild = function() {
        destroyFullPage();

        requestAnimationFrame(function(){
          angular.element(element).fullpage(sanatizeOptions(scope.options));
        });
      };

      var destroyFullPage = function() {
        if ($.fn.fullpage.destroy) {
          $.fn.fullpage.destroy('all');
        }
      };

      var sanatizeOptions = function(options) {
        if (options && options.navigation) {
          options.afterRender = function() {

            //We want to remove the HREF targets for navigation because they use hashbang
            //They still work without the hash though, so its all good.
            $('#fp-nav').find('a').removeAttr('href');
          };
        }

        //if we are using a ui-router, we need to be able to handle anchor clicks without 'href="#thing"'
        $(document).on('click', '[data-menuanchor]', function () {
          $.fn.fullpage.moveTo($(this).attr('data-menuanchor'));
        });

        return options;
      };

      scope.$watch('options', rebuild, true);

      element.on('$destroy', destroyFullPage);
    }
  }

})();
