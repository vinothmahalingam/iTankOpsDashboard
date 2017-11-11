(function ($, window, document, undefined) {

    //"use strict"; 

    var pluginName = 'panelWidget';

    /**
     * Check for touch support and set right click events.
     **/
    /*var clickEvent = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ? 
        'clickEvent' : 'click') + '.' + pluginName;*/

    var clickEvent;

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        clickEvent = 'click tap';
    } else {
        clickEvent = 'click';
    }

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
            var self = this;
            elm.closest(self.o.widgets)
                .find('.panel-saving')
                .stop(true, true)
                .fadeIn(100)
                .delay(500)
                .fadeOut(100);

            /*elm.closest(self.o.widgets)
                .addClass('panel-saving')
                .delay(600).queue(function(){
                    elm.closest(self.o.widgets)
                    .removeClass('panel-saving')
                    .dequeue()
                }); */   

            initApp.accessIndicator();
        },

        _loadKeys : function () {
            
            var self = this;
            var widget_url = self.o.pageKey || location.pathname;

            self.storage.keySettings = 'panelWidget_settings_' + widget_url + '_' + self.objId;
            self.storage.keyPosition = 'panelWidget_position_' + widget_url + '_' + self.objId;
        },

 
        /**
         * Save all settings to the localStorage.
         *
         * @param:
         **/
        _saveSettingsWidget: function () {

            var self = this;
            var storage = self.storage;

            self._loadKeys();

            var storeSettings = self.obj.find(self.o.widgets)
                .map(function () {
                    var storeSettingsStr = {};
                    storeSettingsStr.id = $(this)
                        .attr('id');
                    storeSettingsStr.style = $(this)
                        .attr('data-panel-attstyle');
                    storeSettingsStr.locked = ($(this)
                        .hasClass('panel-locked') ? 1 : 0);
                    storeSettingsStr.collapsed = ($(this)
                        .hasClass('panel-collapse') ? 1 : 0);
                    return storeSettingsStr;
                }).get();

            var storeSettingsObj = JSON.stringify({
                'widget': storeSettings
            });

            /* Place it in the storage(only if needed) */
            if (storage.enabled && storage.getKeySettings != storeSettingsObj) {
                localStorage.setItem(storage.keySettings, storeSettingsObj);
                storage.getKeySettings = storeSettingsObj;

                console.log(storeSettingsObj)
            }

            /**
             * Run the callback function.
             **/
            
            if (typeof self.o.onSave == 'function') {
                self.o.onSave.call(this, null, storeSettingsObj, storage.keySettings);

                console.log("call back: " + storage.keySettings)
            }
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
            /////////////////////// SET SETTINGS WIDGET /////////////////////////
            //*****************************************************************//

            /**
             * Run if data is present.
             **/
            if (self.storage.enabled && self.storage.getKeySettings) {

                var jsonSettings = JSON.parse(self.storage.getKeySettings);

                console.log(self.storage.getKeySettings)

                /**
                 * Loop the data and hide/show the widgets and set the inputs in
                 * panel to checked(if hidden) and add an indicator class to the div.
                 * Loop all labels and update the widget titles.
                 **/
                for (var key in jsonSettings.widget) {
                    var widgetId = $('#' + jsonSettings.widget[key].id);

                    /**
                     * Set a style(if present).
                     **/
                    if (jsonSettings.widget[key].style) {
                        widgetId.attr('data-panel-attstyle', '' + jsonSettings.widget[key].style + '')
                            .children('.panel-hdr')
                            .removeClassPrefix('bg-')
                            .addClass(jsonSettings.widget[key].style);
                    }

                    /**
                     * Hide/show widget.
                     **/
                    /*if (jsonSettings.widget[key].hidden == 1) {
                        widgetId.hide(1);
                    } else {
                        widgetId.show(1)
                            .removeAttr('data-widget-hidden');
                    }*/

                    /**
                     * Toggle content widget.
                     **/
                    if (jsonSettings.widget[key].collapsed == 1) {
                        widgetId.addClass('panel-collapse');
                    }

                    /**
                     * Locked widget from sorting.
                     **/
                    if (jsonSettings.widget[key].locked == 1) {
                        widgetId.addClass('panel-locked');
                    }

                }
            }

            //*****************************************************************//
            ////////////////////////// LOOP ALL WIDGETS /////////////////////////
            //*****************************************************************//

            self.widget.each(function () {

                var tWidget = $(this),
                    closeButton,
                    fullscreenButton,
                    collapseButton,
                    lockedButton,
                    refreshButton,
                    colorButton,
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
                    if (self.o.sortable === true && tWidget.data('panel-sortable') === undefined  /*&& !tWidget.hasClass("panel-locked")*/ ) {
                        tWidget.addClass('panel-sortable');
                    }

                    /**
                    * Add a delete button to the widget header (if set to true).
                    **/
                    if (self.o.closeButton === true && tWidget.data('panel-close') === undefined) {
                        closeButton = '<button class="btn btn-panel js-panel-close" data-toggle="tooltip" data-original-title="Close"></button>';
                    } else {
                        closeButton = '';
                    }

                    /**
                    * Add a delete button to the widget header (if set to true).
                    **/
                    if (self.o.fullscreenButton === true && tWidget.data('panel-fullscreen') === undefined) {
                        fullscreenButton = '<button class="btn btn-panel js-panel-fullscreen" data-toggle="tooltip" data-original-title="Close"></button>';
                    } else {
                        fullscreenButton = '';
                    }

                    /**
                    * Add a delete button to the widget header (if set to true).
                    **/
                    if (self.o.collapseButton === true && tWidget.data('panel-collapse') === undefined) {
                        collapseButton = '<button class="btn btn-panel js-panel-collapse" data-toggle="tooltip" data-original-title="Collapse"></button>'
                    } else {
                        collapseButton = '';
                    }

                    /**
                    * Add a delete button to the widget header (if set to true).
                    **/
                    if (self.o.lockedButton === true && tWidget.data('panel-locked') === undefined) {
                        lockedButton = '<button class="dropdown-item pt-2 pr-3 pb-2 pl-3 js-panel-locked"><span data-i18n="drpdwn.lockpanel">Lock Panel</span></button>'
                    } else {
                        lockedButton = '';
                    }

                    /**
                    * Add a delete button to the widget header (if set to true).
                    **/
                    if (self.o.refreshButton === true && tWidget.data('panel-refresh') === undefined) {
                        refreshButton = '<button class="dropdown-item pt-2 pr-3 pb-2 pl-3 js-panel-refresh"><span data-i18n="drpdwn.refreshpanel">Refresh Panel</span></button>'
                    } else {
                        refreshButton = '';
                    }

                    /**
                    * Add a delete button to the widget header (if set to true).
                    **/
                    if (self.o.colorButton === true && tWidget.data('panel-color') === undefined) {
                        colorButton = '<div class="dropdown-item d-flex align-items-center pt-2 pr-3 pb-2 pl-3">\
                                            <span data-i18n="drpdwn.panelcolor">Panel Color</span>\
                                            <i class="ni ni-chevron-right ml-auto"></i>\
                                            <div class="dropdown-item-menu float-sm-left p-2 d-flex flex-wrap" style="width: 111px">\
                                                <button class="btn btn-m-l d-inline-block btn-secondary width-1 height-1 rounded-0 js-panel-color" data-panel-setstyle="bg-secondary"></button>\
                                                <button class="btn btn-m-l d-inline-block btn-warning width-1 height-1 rounded-0 js-panel-color" data-panel-setstyle="bg-warning-500"></button>\
                                                <button class="btn btn-m-l d-inline-block btn-danger width-1 height-1 rounded-0 js-panel-color" data-panel-setstyle="bg-danger-500"></button>\
                                                <button class="btn btn-m-l d-inline-block btn-info width-1 height-1 rounded-0 js-panel-color" data-panel-setstyle="bg-info-500"></button>\
                                                <button class="btn btn-m-l d-inline-block btn-primary width-1 height-1 rounded-0 js-panel-color" data-panel-setstyle="bg-primary-500"></button>\
                                                <button class="btn btn-m-l d-inline-block btn-success width-1 height-1 rounded-0 js-panel-color" data-panel-setstyle="bg-success-500"></button>\
                                                <button class="btn btn-m-l d-inline-block bg-fusion-500 width-1 height-1 rounded-0 js-panel-color" data-panel-setstyle="bg-fusion-500"></button>\
                                                <button class="btn btn-m-l d-inline-block width-1 height-1 rounded-0 js-panel-color" data-panel-setstyle=""></button>\
                                            </div>\
                                        </div>'
                    } else {
                        colorButton = '';
                    }

                    /**
                     * Prepend the image to the widget header.
                     **/
                    thisHeader.append(
                        '<div class="panel-saving mr-2" style="display:none"><i class="fal fa-spinner-third fa-spin-4x fs-xl"></i></div>'
                    );

                    /**
                     * Set the buttons order.
                     **/
                    var formatButtons = self.o.buttonOrder
                        .replace(/%delete%/g, closeButton)
                        .replace(/%fullscreen%/g, fullscreenButton)
                        .replace(/%toggle%/g, collapseButton);

                    /**
                     * Add a button wrapper to the header.
                     **/
                    if (closeButton !== '' || fullscreenBtn !== '' || toggleBtn !== '') {
                        thisHeader.append('<div class="panel-toolbar">' + formatButtons + '</div>');
                    }

                    /**
                     * Set the buttons order.
                     **/
                    var formatDropdownButtons = self.o.buttonOrderDropdown
                        .replace(/%locked%/g, lockedButton)
                        .replace(/%color%/g, colorButton)
                        .replace(/%refresh%/g, refreshButton);

                    /**
                     * Add a button wrapper to the header.
                     **/
                    if (lockedButton !== '' || colorButton !== '' || refreshButton !== '') {
                        thisHeader.append('<div class="panel-toolbar"><button class="btn btn-toolbar-master" data-toggle="dropdown"><i class="fal fa-ellipsis-v"></i></button><div class="dropdown-menu dropdown-menu-custom dropdown-menu-right p-0">' + formatDropdownButtons + '</div></div>');
                    }    


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
                    cancel: '.btn-panel, .panel-fullscreen .panel-fullscreen, .mod-panel-disable .panel-sortable, .panel-locked.panel-sortable',
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
            ///////////////////////// CLICKEVENTS //////////////////////////
            //*****************************************************************//

            self._clickEvents();

            //*****************************************************************//
            ///////////////////// DELETE LOCAL STORAGE KEYS /////////////////////
            //*****************************************************************//

            if (self.storage.enabled) {
               
                // Delete the settings key.
                $(self.o.deleteSettingsKey)
                    .on(clickEvent, this, function (e) {
                        var cleared = confirm(self.o.settingsKeyLabel);
                        if (cleared) {
                            localStorage.removeItem(keySettings);
                        }
                        e.preventDefault();
                    });

                // Delete the position key.
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

                storage.getKeySettings = localStorage.getItem(storage.keySettings);
                storage.getKeyPosition = localStorage.getItem(storage.keyPosition);
                
            } // end if

        },

        /**
         * All of the click events.
         *
         * @param:
         **/
        _clickEvents: function () {

            var self = this;
            var headers = self.widget.children('.panel-hdr');

            /**
             * Allow users to toggle the content of the widgets.
             **/
            headers.on(clickEvent, '.js-panel-collapse', function (e) {

                var tWidget = $(this);
                var pWidget = tWidget.closest(self.o.widgets);

                /**
                 * Run function for the indicator image.
                 **/
                if( typeof($.fn.tooltip) !== 'undefined' && $('[data-toggle="tooltip"]').length ){
                    $(this).tooltip('hide');
                } else {
                    console.log("bs.tooltip is not loaded");
                }   

                /**
                 * Run function for the indicator image.
                 **/
                pWidget.toggleClass("panel-collapse");

                /**
                 * Run function for the indicator image.
                 **/
                self._runLoaderWidget(tWidget);


                /**
                 * Run the callback function.
                 **/
                if (typeof self.o.onCollapse == 'function') {
                    self.o.onCollapse.call(this, pWidget);
                }

                /**
                 * Lets save the setings.
                 **/
                self._saveSettingsWidget();             
                
                e.preventDefault();
            });

            /**
             * Allow users to toggle the content of the widgets.
             **/
            headers.on(clickEvent, '.js-panel-fullscreen', function (e) {

                var tWidget = $(this);
                var pWidget = tWidget.closest(self.o.widgets);

                /**
                 * Run function for the indicator image.
                 **/
                if( typeof($.fn.tooltip) !== 'undefined' && $('[data-toggle="tooltip"]').length ){
                    $(this).tooltip('hide');
                } else {
                    console.log("bs.tooltip is not loaded");
                }   

                /**
                 * Run function for the indicator image.
                 **/
                pWidget.toggleClass("panel-fullscreen");
                myapp_config.root_.toggleClass('panel-fullscreen');

                /**
                 * Run function for the indicator image.
                 **/
                self._runLoaderWidget(tWidget);


                /**
                 * Run the callback function.
                 **/
                if (typeof self.o.onFullscreen == 'function') {
                    self.o.onFullscreen.call(this, pWidget);
                }

                e.preventDefault();
            });

            /**
             * Allow users to toggle the content of the widgets.
             **/
            headers.on(clickEvent, '.js-panel-close', function (e) {

                var tWidget = $(this);
                var pWidget = tWidget.closest(self.o.widgets);

                /**
                 * Run function for the indicator image.
                 **/
                if( typeof($.fn.tooltip) !== 'undefined' && $('[data-toggle="tooltip"]').length ){
                    $(this).tooltip('hide');
                } else {
                    console.log("bs.tooltip is not loaded");
                }   

                /**
                 * Run function for the indicator image.
                 **/
                pWidget.fadeOut(500,function(){
                    /* remove panel */
                    $(this).remove();
                    /**
                     * Run the callback function.
                     **/
                    if (typeof self.o.onClose == 'function') {
                        self.o.onClose.call(this, pWidget);
                    }
                });  

                /**
                 * Run function for the indicator image.
                 **/
                self._runLoaderWidget(tWidget);

                e.preventDefault();
            });

            /**
             * Allow users to toggle the content of the widgets.
             **/
            headers.on(clickEvent, '.js-panel-color', function (e) {

                var tWidget = $(this);
                var pWidget = tWidget.closest(self.o.widgets);
                var selectedHdr = tWidget.closest('.panel-hdr');
                var val = tWidget.data('panel-setstyle');

                /**
                 * Run the callback function.
                 **/
                selectedHdr.removeClassPrefix('bg-')
                    .addClass(val)
                    .closest('.panel')
                    .attr('data-panel-attstyle', '' + val + '');              

                /**
                 * Run the callback function.
                 **/
                if (typeof self.o.onColor == 'function') {
                    self.o.onColor.call(this, pWidget);
                }

                /**
                 * Run function for the indicator image.
                 **/
                self._runLoaderWidget(tWidget);

                /**
                 * Lets save the setings.
                 **/
                self._saveSettingsWidget();

                e.preventDefault();
            });

            /**
             * Allow users to toggle the content of the widgets.
             **/
            headers.on(clickEvent, '.js-panel-locked', function (e) {

                var tWidget = $(this);
                var pWidget = tWidget.closest(self.o.widgets);

                /**
                 * Run function for the indicator image.
                 **/
                pWidget.toggleClass("panel-locked");

                /**
                 * Run function for the indicator image.
                 **/
                self._runLoaderWidget(tWidget);


                /**
                 * Run the callback function.
                 **/
                if (typeof self.o.onLocked == 'function') {
                    self.o.onLocked.call(this, pWidget);
                }

                /**
                 * Lets save the setings.
                 **/
                self._saveSettingsWidget();             
                
                e.preventDefault();
            });

            headers = null;

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
        dragHandle: '> .panel-hdr > h2',
        localStorage: true,
        onChange: function () {},
        onSave: function () {},
        opacity: 1,
        deleteSettingsKey: '',
        settingsKeyLabel: 'Reset settings?',
        deletePositionKey: '',
        positionKeyLabel: 'Reset position?',
        sortable: true,
        buttonOrder: '%toggle% %fullscreen% %delete%',
        buttonOrderDropdown: '%refresh% %locked% %color%',
        closeButton: true,
        onClosepanel: function() {
            console.log($(this).closest(".panel").attr('id') + " onClosepanel callback")
        },
        fullscreenButton: true,
        onFullscreen: function() {
            console.log($(this).closest(".panel").attr('id') + " onFullscreen callback")
        },
        collapseButton: true,
        onCollapse: function() {
            console.log($(this).closest(".panel").attr('id') + " collapsed callback")
        },
        lockedButton: true,
        onLocked: function() {
             console.log($(this).closest(".panel").attr('id') + " onLocked callback")
        },
        refreshButton: true,
        onRefresh: function() {
            console.log($(this).closest(".panel").attr('id') + " onRefresh callback")
        },
        colorButton: true,
        onColor: function() {
            console.log($(this).closest(".panel").attr('id') + " onColor callback")
        }
    };

})(jQuery, window, document);