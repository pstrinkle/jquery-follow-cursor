/**
 * jquery-follow-cursor - jQuery Plugin to rotate an element to follow the 
 * cursor position.
 * 
 * URL: http://pstrinkle.github.io/jquery-follow-cursor
 * Author: Patrick Trinkle <https://github.com/pstrinkle>
 * Version: 1.0.0
 * Copyright 2016 Patrick Trinkle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {
    function FollowCursor(config) {
        this.init(config);
    }

    FollowCursor.prototype = {
        middleX : 0,
        middleY : 0,

        //----------------------- protected properties and methods -------------
        /**
         * @protected
         */
        constructor: FollowCursor,

        /**
         * Container element. Should be passed into constructor config
         * @protected
         * @type {jQuery}
         */
        el: null,

        /**
         * Init/re-init the object
         * @param {object} config - Config
         */
        init: function(config) {
            $.extend(this, config);
        },
        
        handleMove: function(event) {
            var newY = 0;
            var newX = 0;
            var middleX = this.middleX;
            var middleY = this.middleY;
            var degrees = 0;

            /* done together in just four quadrants. */
            if (event.pageY < middleY && event.pageX < middleX) {
              /* upper left. */
              newY = middleY - event.pageY;
              newX = middleX - event.pageX;

              var radians = Math.atan2(newY, newX);
              degrees = radians * (180 / Math.PI);
              degrees = 90 - degrees;
              degrees *= -1;
            } else if (event.pageY < middleY && event.pageX > middleX) {
              /* upper right. */
              newY = middleY - event.pageY;
              newX = event.pageX - middleX;
              add = 0.25 * 360;

              var radians = Math.atan2(newY, newX);
              degrees = radians * (180 / Math.PI);
              degrees = 90 - degrees;
            } else if (event.pageY > middleY && event.pageX > middleX) {
              /* lower right. */
              newY = event.pageY - middleY;
              newX = event.pageX - middleX;
              add = 0.5 * 360;

              var radians = Math.atan2(newY, newX);
              degrees = radians * (180 / Math.PI);
              degrees += 90;
            } else if (event.pageY > middleY && event.pageX < middleX) {
              /* lower left. */
              newY = event.pageY - middleY;
              newX = middleX - event.pageX;
              add = 0.75 * 360;

              var radians = Math.atan2(newY, newX);
              degrees = radians * (180 / Math.PI);
              degrees += 90;
              degrees *= -1;
            } else if (event.pageX < middleX && event.pageY == middleY) {
              /* west */
              degrees = -90;
            } else if (event.pageX == middleX && event.pageY > middleY) {
              /* south */              
              degrees = -180;
            } else if (event.pageX > middleX && event.pageY == middleY) {
              /* east */              
              degrees = 90;
            }

            var $cvs = this.el;
            // the degrees in this transform are absolute!
            $cvs.css('-ms-transform', 'rotate(' + degrees + 'deg)');
            $cvs.css('-o-transform', 'rotate(' + degrees + 'deg)');
            $cvs.css('-webkit-transform', 'rotate(' + degrees + 'deg)');
            $cvs.css('-moz-transform', 'rotate(' + degrees + 'deg)');
        }
    }
    
    //----------------------- Initiating jQuery plugin -------------------------

    /**
     * Set an element to rotate following the mouse movement.
     */
    $.fn.followCursor = function() {
        var dataName = 'followCursor';

        return this.each(function() {
            var el = $(this);
            var initialConfig = $.extend({}, el.data());
            config = $.extend(initialConfig, {});
            config.el = el;
            var instance = new FollowCursor(config);

            var position = el.offset();
            var realWidth = el.outerWidth();
            var realHeight = el.outerHeight();
            var middleX = position.left + (el.width() / 2);
            var middleY = position.top + (el.height() / 2);

            instance.middleX = middleX;
            instance.middleY = middleY;

            el.data(dataName, instance);

            $(document).mousemove(function(event) {
                instance.handleMove(event);
            });
        });
    };
}(jQuery));
