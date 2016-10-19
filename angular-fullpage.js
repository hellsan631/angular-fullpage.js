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
      var afterRender;
      var onLeave;
      var onSlideLeave;

      if (typeof scope.options === 'object') {
        if (scope.options.afterRender) {
          afterRender = scope.options.afterRender;
        }

        if (scope.options.onLeave) {
          onLeave = scope.options.onLeave;
        }

        if (scope.options.onSlideLeave) {
          onSlideLeave = scope.options.onSlideLeave;
        }
      } else if(typeof options === 'undefined') {
        scope.options = {};
      }

      var rebuild = function() {
        destroyFullPage();

        $(element).fullpage(sanatizeOptions(scope.options));

        if (typeof afterRender === 'function') {
          afterRender();
        }
      };

      var destroyFullPage = function() {
        if ($.fn.fullpage.destroy) {
          $.fn.fullpage.destroy('all');
        }
      };

      var sanatizeOptions = function(options) {
        options.afterRender = afterAngularRender;
        options.onLeave = onAngularLeave;
        options.onSlideLeave = onAngularSlideLeave;

        function afterAngularRender() {
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
        }

        function onAngularLeave(page, next, direction){

          if (typeof onLeave === 'function' && onLeave(page, next, direction) === false) {
            return false;
          }
          pageIndex = next;

        }

        function onAngularSlideLeave(anchorLink, page, slide, direction, next) {

          if (typeof onSlideLeave === 'function' && onSlideLeave(anchorLink, page, slide, direction, next) === false) {
            return false;
          }
          pageIndex   = page;
          slideIndex  = next;

        }

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
