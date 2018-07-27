// wrapped by build app
define("MobileFeatures/MobileFeatures.webmodeler", ["dojo","dijit","dojox"], function(dojo,dijit,dojox){
/*global React, window */

module.exports.preview = React.createClass({
    render: function () {
        return React.DOM.div({ className: "widget-mobile-features-hide-preview" });
    }
});

});
