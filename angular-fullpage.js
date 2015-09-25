;(function() {
  'use strict';

  angular
    .module('fullPage.js', [])
    .directive('fullPage', fullPage);

  fullPage.$inject = ['$timeout'];

  function fullPage($timeout) {
    var directive = {
      restrict: 'A',
      scope: {options: '='},
      link: link
    };

    return directive;

    function link(scope, element) {
      var pageIndex;
      var slideIndex;

      var rebuild = function() {
        destroyFullPage();

        angular.element(element).fullpage(sanatizeOptions(scope.options));
      };

      var destroyFullPage = function() {
        if ($.fn.fullpage.destroy) {
          $.fn.fullpage.destroy('all');
        }
      };

      var sanatizeOptions = function(options) {
        options.onLeave = function(page, next){
          pageIndex = next;
        };

        options.onSlideLeave = function(anchorLink, page, slide, direction, next){
          pageIndex   = page;
          slideIndex  = next;
        };

        options.afterRender = function(){
          //We want to remove the HREF targets for navigation because they use hashbang
          //They still work without the hash though, so its all good.
          if (options && options.navigation) {
            $('#fp-nav').find('a').removeAttr('href');
          }

          if (pageIndex) {
            $timeout(function() {
              $.fn.fullpage.silentMoveTo(pageIndex, slideIndex);
            });
          }
        };

        //if we are using a ui-router, we need to be able to handle anchor clicks without 'href="#thing"'
        $(document).on('click', '[data-menuanchor]', function () {
          $.fn.fullpage.moveTo($(this).attr('data-menuanchor'));
        });

        return options;
      };

      var watchNodes = function() {
        return element[0].getElementsByTagName('*').length;
      };

      scope.$watch(watchNodes, rebuild);

      scope.$watch('options', rebuild, true);

      element.on('$destroy', destroyFullPage);
    }
  }

})();
