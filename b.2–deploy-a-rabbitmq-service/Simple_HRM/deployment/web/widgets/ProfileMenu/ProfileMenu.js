/*jslint indent: 4, forin: true */
/*global dojo, logger, mx, window*/
require([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/io/script",
    "dojo/dom-class"
], function (declare, _WidgetBase, ioScript, domClass) {

    return declare("ProfileMenu.ProfileMenu", _WidgetBase, {
    	inputargs: {
    		mendixserver : ''
    	},

    	postCreate : function() {
			domClass.add(this.domNode, "mx-profilemenu-button-placeholder");

             var url = this.mendixserver + (this.mendixserver.match(/\/$/) != null ? "" : "/");
            
			if (!window.mxButtonSettings) {
                window.mxButtonSettings = {
                    baseUrl: url
                };
            }

            window.mxButtonSettings.baseUrl = url;
            window.mxButtonSettings.started = false;
            window.mxButtonSettings.profileMenuHeight = this.frameHeight;
            window.mxButtonSettings.profileMenuWidth = this.frameWidth;
            window.mxButtonSettings.profileMenuIconColor = this.iconColor;
            window.mxButtonSettings.profileMenuIconSize = this.iconSize;
            window.mxButtonSettings.profileMenuPopupBehavior = this.popupBehavior;

            ioScript.get({
                url: url + 'mendixtoolbar/js/buttonservices.js?PP_6.20',
                error: dojo.hitch(this, function (e) {
                    console && console.log('Mendix Profile Menu could not load external script: ', e);
                })
            });
		},
        
    	uninitialize: function () {
            if (typeof window.mxButtons !== "undefined") {
                window.mxButtons.uninitializeProfileMenu();
            }
        }

    });
});