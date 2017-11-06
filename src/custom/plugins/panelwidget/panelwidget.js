(function ($, window, document, undefined) {

    //"use strict"; 

    var pluginName = 'panelWidget';

    /**
     * Check for touch support and set right click events.
     **/
    var clickEvent = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ? 
        'clickEvent' : 'click') + '.' + pluginName;

    function Plugin(element, options) {
        /**
         * Variables.
         **/
        this.obj = $(element);
        this.o = $.extend({}, $.fn[pluginName].defaults, options);
        this.objId = this.obj.attr('id');
        this.widget = this.obj.find(this.o.widgets);
        this.storage = {enabled: this.o.localStorage};
        this.initialized = false;
        this.init();
    }

    Plugin.prototype = {

        /**
         * Function for the indicator image.
         *
         * @param:
         **/
        _runLoaderWidget: function (elm) {
            /*var self = this;
            if (self.o.indicator === true) {
                elm.parents(self.o.widgets)
                    .find('.panel-widget-loader:first')
                    .stop(true, true)
                    .fadeIn(100)
                    .delay(100)
                    .fadeOut(100);
            }*/
            self.o.widgets.addClass("saving").delay(100).removeClass("saving");
            initApp.accessIndicator();
        },

        _loadKeys : function () {
            
            var self = this;
            var widget_url = self.o.pageKey || location.pathname;
            self.storage.keyPosition = 'panelWidget_position_' + widget_url + '_' + self.objId;
        },

        /**
         * Save positions to the localStorage.
         *
         * @param:
         **/
        _savePositionWidget: function () {

            var self = this;
            var storage = self.storage;

            self._loadKeys();

            var mainArr = self.obj.find(self.o.grid + '.sortable-grid')
                .map(function () {
                    var subArr = $(this)
                        .children(self.o.widgets)
                        .map(function () {
                            return {
                                'id': $(this).attr('id')
                            };
                        }).get();
                    return {
                        'section': subArr
                    };
                }).get();

            var storePositionObj = JSON.stringify({
                'grid': mainArr
            });

            /* Place it in the storage(only if needed) */
            if (storage.enabled && storage.getKeyPosition != storePositionObj) {
                localStorage.setItem(storage.keyPosition, storePositionObj);
                storage.getKeyPosition = storePositionObj
            }

            /**
             * Run the callback function.
             **/
            if (typeof self.o.onSave == 'function') {
                self.o.onSave.call(this, storePositionObj, storage.keyPosition);
            }
        },

        /**
         * Code that we run at the start.
         *
         * @param:
         **/
        init: function () {

            var self = this;
            
            if (self.initialized) return;

            self._initStorage(self.storage);

            /**
             * Force users to use an id(it's needed for the local storage).
             **/
            if (!$('#' + self.objId)
                .length) {
                alert('Your widget ID is missing!');
            }

            /**
             * This will add an extra class that we use to store the
             * widgets in the right order.(savety)
             **/

            $(self.o.grid)
                .each(function () {
                    if ($(this)
                        .find(self.o.widgets)
                        .length) {
                        $(this)
                            .addClass('sortable-grid');
                    }
                });

            //*****************************************************************//
            //////////////////////// SET POSITION WIDGET ////////////////////////
            //*****************************************************************//

            /**
             * Run if data is present.
             **/
            if (self.storage.enabled && self.storage.getKeyPosition) {

                var jsonPosition = JSON.parse(self.storage.getKeyPosition);

                /**
                 * Loop the data, and put every widget on the right place.
                 **/
                for (var key in jsonPosition.grid) {
                    var changeOrder = self.obj.find(self.o.grid + '.sortable-grid')
                        .eq(key);
                    for (var key2 in jsonPosition.grid[key].section) {
                        changeOrder.append($('#' + jsonPosition.grid[key].section[key2].id));
                    }
                }

            }

            //*****************************************************************//
            ////////////////////////// LOOP ALL WIDGETS /////////////////////////
            //*****************************************************************//

            self.widget.each(function () {

                var tWidget = $(this),
                    thisHeader = $(this).children('.panel-hdr');

                /**
                 * Dont double wrap(check).
                 **/
                if (!thisHeader.parent()
                    .attr('role')) {


                    /**
                     * Adding a helper class to all sortable widgets, this will be
                     * used to find the widgets that are sortable, it will skip the widgets
                     * that have the dataset 'widget-sortable="false"' set to false.
                     **/
                    if (self.o.sortable === true && tWidget.data('panel-sortable') === undefined) {
                        tWidget.addClass('panel-sortable');
                    }

                    /**
                     * Prepend the image to the widget header.
                     **/
                    /*thisHeader.append(
                        '<div class="panel-widget-loader"><i class="fal fa-circle fa-spin opacity-0"></i></div>'
                    );*/

                    /**
                     * Adding roles to some parts.
                     **/
                    tWidget.attr('role', 'widget')
                        .children('div')
                        .attr('role', 'content')
                        .prev('.panel-hdr')
                        .attr('role', 'heading')
                        .children('.panel-toolbar')
                        .attr('role', 'menu');
                }
            });

            //******************************************************************//
            ////////////////////////////// SORTABLE //////////////////////////////
            //******************************************************************//

            /**
             * jQuery UI soratble, this allows users to sort the widgets.
             * Notice that this part needs the jquery-ui core to work.
             **/
            if (self.o.sortable === true && jQuery.ui) {
                var sortItem = self.obj.find(self.o.grid + '.sortable-grid')
                    .not('[data-widget-excludegrid]');
                sortItem.sortable({
                    items: sortItem.find(self.o.widgets + '.panel-sortable'),
                    connectWith: sortItem,
                    placeholder: self.o.placeholderClass,
                    cursor: 'move',
                    revert: true,
                    opacity: self.o.opacity,
                    delay: 50,
                    revert: 250,
                    cancel: '.btn-panel, .panel-fullscreen .panel-fullscreen, .mod-panel-disable .panel-sortable',
                    zIndex: 10000,
                    handle: self.o.dragHandle,
                    forcePlaceholderSize: true,
                    forceHelperSize: true,
                    update: function (event, ui) {
                        /* run pre-loader in the widget */
                        self._runLoaderWidget(ui.item.children());
                        /* store the positions of the plugins */
                        self._savePositionWidget();
                        /**
                         * Run the callback function.
                         **/
                        if (typeof self.o.onChange == 'function') {
                            self.o.onChange.call(this, ui.item);
                        }
                    }
                });
            }

            //*****************************************************************//
            ///////////////////// DELETE LOCAL STORAGE KEYS /////////////////////
            //*****************************************************************//

            if (self.storage.enabled) {
                /**
                 * Delete the settings key.
                 **/
                $(self.o.deleteSettingsKey)
                    .on(clickEvent, this, function (e) {
                        var cleared = confirm(self.o.settingsKeyLabel);
                        if (cleared) {
                            localStorage.removeItem(keySettings);
                        }
                        e.preventDefault();
                    });
                /**
                 * Delete the position key.
                 **/
                $(self.o.deletePositionKey)
                    .on(clickEvent, this, function (e) {
                        var cleared = confirm(self.o.positionKeyLabel);
                        if (cleared) {
                            localStorage.removeItem(keyPosition);
                        }
                        e.preventDefault();
                    });
            }

            initialized = true;
        },

        /**
         * Initialize storage.
         *
         * @param:
         **/
        _initStorage: function (storage) {

            //*****************************************************************//
            //////////////////////// LOCALSTORAGE CHECK /////////////////////////
            //*****************************************************************//

            storage.enabled = storage.enabled && !! function () {
                var result, uid = +new Date();
                try {
                    localStorage.setItem(uid, uid);
                    result = localStorage.getItem(uid) == uid;
                    localStorage.removeItem(uid);
                    return result;
                } catch (e) {}
            }();

            this._loadKeys();

            if (storage.enabled) {
                storage.getKeyPosition = localStorage.getItem(storage.keyPosition);
                
            } // end if

        },

        /**
         * Destroy.
         *
         * @param:
         **/
        _initDestroy: function () {
            var self = this, 
            namespace = '.' + pluginName, 
            sortItem = self.obj.find(self.o.grid + '.sortable-grid').not('[data-widget-excludegrid]');
            self.widget.removeClass('panel-sortable');
            sortItem.sortable('destroy');
            self.widget.children('.panel-hdr').off(namespace);
            $(self.o.deletePositionKey).off(namespace);
            $(window).off(namespace);
            self.obj.removeData(pluginName);
        }
    };

    $.fn[pluginName] = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(pluginName);
            if (!data) {
                var options = typeof option == 'object' && option;
                $this.data(pluginName, (data = new Plugin(this, options)));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

    /**
     * Default settings(dont change).
     * You can globally override these options
     * by using $.fn.pluginName.key = 'value';
     **/

    $.fn[pluginName].defaults = {
        grid: '[class*="col-"]',
        widgets: '.panel',
        placeholderClass: 'panel-placeholder',
        dragHandle: '> .panel-hdr > .panel-title',
        localStorage: true,
        opacity: 1,
        deleteSettingsKey: '',
        settingsKeyLabel: 'Reset settings?',
        deletePositionKey: '',
        positionKeyLabel: 'Reset position?',
        sortable: true,
        onChange: function () {},
        onSave: function () {}
    };

})(jQuery, window, document);