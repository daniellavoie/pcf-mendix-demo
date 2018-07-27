/*jslint indent: 4, forin: true */
/*global dojo, logger, mx, window*/
require([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/io/script",
    "dojo/dom-class"
], function (declare, _WidgetBase, ioScript, domClass) {

    return declare("AppCloudNavigation.AppCloudNavigation", _WidgetBase, {
		inputargs: {
			mendixserver : ''
		},

		postCreate : function() {
			domClass.add(this.domNode, "mx-mendixtoolbar");

			if (!window.mxToolbarSettings || window.mxToolbarSettings.started !== true) {

				var url = this.mendixserver + (this.mendixserver.match(/\/$/) != null ? "" : "/");
				window.mxToolbarSettings = {
					toolbarBaseUrl: url
				};

				ioScript.get({
					url: url + 'mendixtoolbar/js/appcloudservice.js?PP_5.27',
					error : dojo.hitch(this, function (e) {
						console && console.log('Mendix AppCloud Navigation could not load external script: ', e);
					})
				});
			}
		},
		
		uninitialize : function() {

		}

	});
});