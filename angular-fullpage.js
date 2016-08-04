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

        $(document).off('click', '[data-menuanchor]');
      };

      var sanatizeOptions = function(options) {
        var onLeave;
        var onSlideLeave;
        var afterRender;
        var sanatized;

        //Copy options to a clone of them so that the scope.options reference isn't changed
        if (options) {
          sanatized = clone(options);
        } else {
          sanatized = {};
        }

        //Clone any functions that we overwrite with angular compataible functions
        if (options.afterRender && typeof options.afterRender === 'function') {
          afterRender = options.afterRender.bind({});
        }

        if (options.onLeave && typeof options.onLeave === 'function') {
          onLeave = options.onLeave.bind({});
        }

        if (options.onSlideLeave && typeof options.onSlideLeave === 'function') {
          onSlideLeave = options.onSlideLeave.bind({});
        }


        sanatized.afterRender  = afterAngularRender;
        sanatized.onLeave      = onAngularLeave;
        sanatized.onSlideLeave = onAngularSlideLeave;

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

          if (typeof afterRender === 'function') {
            afterRender();
          }

          //if we are using a ui-router, we need to be able to handle anchor clicks without 'href="#thing"'
          $(document).on('click', '[data-menuanchor]', function () {
            console.log('function clicking', $(this).attr('data-menuanchor'));
            $.fn.fullpage.moveTo($(this).attr('data-menuanchor'));
          });
        }

        function onAngularLeave(page, next){
          pageIndex = next;

          if (typeof onLeave === 'function') {
            onLeave();
          }
        }

        function onAngularSlideLeave(anchorLink, page, slide, direction, next) {
          pageIndex   = page;
          slideIndex  = next;

          if (typeof onSlideLeave === 'function') {
            onSlideLeave();
          }
        }

        return sanatized;
      };

      var watchNodes = function() {
        return element[0].getElementsByTagName('*').length;
      };

      function clone(obj) {
        if (obj === null || typeof obj !== 'object') {
          return obj;
        }

        var copy = {};

        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) {

            if (typeof obj[attr] === 'object') {
              copy[attr] = clone(obj[attr]);
            } else if (typeof obj[attr] === 'function') {
              copy[attr] = obj[attr].bind({});
            } else if (typeof obj[attr] === 'undefined') {
              copy[attr] = null;
            } else {
              copy[attr] = JSON.parse(JSON.stringify(obj[attr]));
            }

          }
        }

        return copy;
      }

      scope.$watch(watchNodes, rebuild);

      scope.$watch('options', rebuild, true);

      element.on('$destroy', destroyFullPage);
    }
  }

})();
