/*jslint indent: 4, forin: true */
/*global dojo, logger, mx, window*/
require([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/io/script",
    "dojo/dom-class"
], function (declare, _WidgetBase, ioScript, domClass) {

    return declare("AppSwitcher.AppSwitcher", _WidgetBase, {
        inputargs: {
            mendixserver: ''
        },

        postCreate: function () {
            domClass.add(this.domNode, "mx-appswitcher-button-placeholder");

            var url = this.mendixserver + (this.mendixserver.match(/\/$/) != null ? "" : "/");

            if (!window.mxButtonSettings) {
                window.mxButtonSettings = {
                    baseUrl: url
                };
            }

            window.mxButtonSettings.baseUrl = url;
            window.mxButtonSettings.started = false;
            window.mxButtonSettings.appSwitcherHeight = this.frameHeight;
            window.mxButtonSettings.appSwitcherWidth = this.frameWidth;
            window.mxButtonSettings.appSwitcherIconColor = this.iconColor;
            window.mxButtonSettings.appSwitcherIconSize = this.iconSize;
            window.mxButtonSettings.appSwitcherPopupBehavior = this.popupBehavior;

            ioScript.get({
                url: url + 'mendixtoolbar/js/buttonservices.js?PP_6.20',
                error: dojo.hitch(this, function (e) {
                    console && console.log('Mendix AppSwitcher could not load external script: ', e);
                })
            });
        },
        
        uninitialize: function () {
            if (typeof window.mxButtons !== "undefined") {
                window.mxButtons.uninitializeAppSwitcher();
            }
        }

    });
});