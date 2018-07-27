require({cache:{
'MobileFeatures/widget/MobileFeatures':function(){
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/_base/lang",
    "dojo/aspect",

    "MobileFeatures/widget/plugins/spinner",
    "MobileFeatures/widget/plugins/dialog",
    "MobileFeatures/widget/plugins/transitions",
    "MobileFeatures/widget/plugins/classes",
    "MobileFeatures/widget/plugins/statusbar",
    "MobileFeatures/widget/plugins/customconnectionerror",
    "MobileFeatures/widget/plugins/advanced"

], function(declare, _WidgetBase, lang, aspect, spinner, dialog, transitions, classes, statusbar, customconnectionerror, advanced) {
    "use strict";

    return declare("MobileFeatures.widget.MobileFeatures", [
        _WidgetBase,
        spinner, dialog, transitions, classes, statusbar, customconnectionerror, advanced
    ], {

        _phonegapEnabled: false,
        _onLogout: null,

        constructor: function () {
            this._phonegapEnabled = (typeof cordova !== "undefined");
            this._phonegapEnabled && this.advancedListViewLazyLoad && this._enableListViewLazyLoad();
            this._phonegapEnabled && this.advancedGroupboxLazyLoad && this._enableGroupboxLazyLoad();
        },

        _debuggingKey: "MobileFeatures_debugging",

        _getDebugging: function () {
            logger.debug(this.id + "._getDebugging");
            var storage = window.localStorage;
            var val = storage.getItem(this._debuggingKey);
            if (val) {
                window.__MobileFeatures_debugging = val === "true";
            } else {
                this.setDebugging(false);
            }
        },

        setDebugging: function (val) {
            var storage = window.localStorage;
            storage.setItem(this._debuggingKey, val);
            window.__MobileFeatures_debugging = val;
        },

        postCreate: function() {
            this.debug(".postCreate");

            window.__MobileFeaturesWidget = this;
            if (typeof window.__MobileFeatures_debugging === "undefined") {
                this._getDebugging();
            }

            if (this._phonegapEnabled) {
                this.spinnerEnabled && this._enableSpinner();
                this.dialogEnabled && this._enableDialog();
                this.transitionsEnabled && this._enableTransitions();
                this._enableClasses();
                this.statusbarEnabled && this._enableStatusbar();
                this.customConnectionErrorEnabled && this._enableCustomConnectionError();

                if (this.disableOnLogout) {
                        this._onLogout = aspect.before(window.mx, "logout", lang.hitch(this, function () {
                        this.debug(".beforeLogout");
                        this._disableMobileFeatures();
                        this._onLogout.remove();
                    }));
                }
            } else {
                console.warn(this.id + " widget is only enabled in Hybrid Mobile app (Phonegap)");
            }
        },

        uninitialize: function() {
            this.debug(".uninitialize");
            this._disableMobileFeatures();
        },

        _disableMobileFeatures: function() {
            this.debug("._disableMobileFeatures");
            if (this._phonegapEnabled) {
                this._disableClasses();
                this.spinnerEnabled && this._disableSpinner();
                this.transitionsEnabled && this._cleanupTransitions();
                this.customConnectionErrorEnabled && this._disableCustomConnectionError();
            }
        },

        debug: function() {
            [].unshift.call(arguments, this.id);
            if (window.__MobileFeatures_debugging) {
                console.log.apply(console, arguments);
            } else {
                logger.debug.apply(this, arguments);
            }
        }
    });
});

require(["MobileFeatures/widget/MobileFeatures"]);

},
'MobileFeatures/widget/plugins/spinner':function(){
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
], function(declare, lang) {
    "use strict";

    return declare("MobileFeatures.widget.plugin.spinner", [], {

        // Set in modeler
        spinnerEnabled: false,
        spinnerDelay: 500,

        spinnerOptions: {
            dimBackground: true
        },

        // Internal variables.
        _spinnerShowTimer: null,
        _spinnerShowing: false,
        _spinnerShowPending: false,

        _spinnerMessageId: 1,
        _spinnerMessages: null,
        _spinnerEnabled: false,

        _findInArray: function(array, test, scope) {
            for (var i = 0; i < array.length; i++) {
                if (test.call(scope, array[i], i, array)) return array[i];
            }
            return undefined;
        },

        _findIndex : function(array, test) {
            for (var i = 0; i < array.length; i++) {
                if (test(array[i], i)) return i;
            }
            return -1;
        },

        // spinner
        _enableSpinner: function() {
            this.debug("._enableSpinner");

            if (window.SpinnerPlugin && !mx.ui.hideProgressOrig) {
                mx.ui.showProgressOrig = mx.ui.showProgress;
                mx.ui.showProgress = this._spinnerShowProgressReplacement.bind(this);

                if (!mx.ui.hideProgressOrig) {
                    mx.ui.hideProgressOrig = mx.ui.hideProgress;
                }

                mx.ui.hideProgress = this._spinnerHideProgressReplacement.bind(this);
                //mx.ui.hideProgressOrig(0);

                this._spinnerMessages = [];
                this._spinnerEnabled = true;
            } else if (!!mx.ui.hideProgressOrig) {
                this.debug("._enableSpinner spinner is already enabled. Locking previous one");
                if (!window.__SpinnerLock) {
                    window.__SpinnerLock = true;
                }
                this._spinnerEnabled = true;
            } else {
                console.warn(this.id + "._enableSpinner spinner not enabled. 'cordova-plugin-spinner' plugin missing in Phonegap");
            }
        },

        _disableSpinner: function() {
            if (window.__SpinnerLock) {
                this.debug("._disableSpinner not running, got another instance requesting this.");
                window.__SpinnerLock = false;
                return;
            }
            this.debug("._disableSpinner");
            this._spinnerEnabled = false;
            if (this._spinnerShowTimer !== null) {
                clearTimeout(this._spinnerShowTimer);
            }
            if (mx.ui.hideProgressOrig) {
                mx.ui.hideProgress = mx.ui.hideProgressOrig;
                mx.ui.hideProgressOrig = null;
            }
            if (mx.ui.showProgressOrig) {
                mx.ui.showProgress = mx.ui.showProgressOrig;
                mx.ui.showProgressOrig = null;
            }
        },

        _spinnerShowProgressReplacement: function(msg, modal) {
            this.debug("._spinnerShowProgressReplacement");
            var id = this._spinnerMessageId++;
            this._spinnerMessages.push({
                id: id,
                text: msg,
                modal: modal
            });

            if (!this._spinnerShowTimer) {
                this._spinnerShowPending = true;
                this._spinnerShowTimer = setTimeout(lang.hitch(this, function() {
                    this._spinnerShowing = true;
                    this._spinnerShowPending = false;
                    this._spinnerShowTimer = null;
                    if (!this._spinnerEnabled) {
                        this.debug(".Spinner not shown, is disabled");
                        return;
                    }
                    window.SpinnerPlugin.activityStart(
                        !!msg ? msg : null,
                        !!msg ? this.spinnerOptions : { dimBackground: false },
                        lang.hitch(this, function () {
                            this.debug("._spinnerShow succes");
                        }),
                        lang.hitch(this, function () {
                            this.debug("._spinnerShow failed");
                        })
                    );
                    this._spinnerShowTimer = null;
                }), this.spinnerDelay);
            }
            return id;
        },

        _hideSpinner: function () {
            window.SpinnerPlugin.activityStop(
                lang.hitch(this, function () {
                    this.debug("._spinnerHide succes");
                }),
                lang.hitch(this, function () {
                    this.debug("._spinnerHide failed");
                })
            );
        },

        _spinnerHideProgressReplacement: function(pid) {
            this.debug("._spinnerHideProgressReplacement " + pid + "/" + this._spinnerShowPending);

            var message = this._findInArray(this._spinnerMessages, function (msg) {
                return msg.id === pid;
            });

            if (this._spinnerShowPending) {
                this.debug("._spinnerHideProgressReplacement pending");
                clearTimeout(this._spinnerShowTimer);
                this._spinnerShowTimer = null;
                this._spinnerShowPending = false;
                this._spinnerShowing = false;
                this._hideSpinner();
                if (message) {
                    this._removeMsg(pid);
                }
            } else if (this._spinnerShowing && message) {
                this.debug("._spinnerHideProgressReplacement has message");
                this._spinnerShowPending = false;
                this._spinnerShowing = false;
                this._hideSpinner();
                this._removeMsg(pid);
            } else if (pid !== null && pid !== undefined) {
                this.debug("._spinnerHideProgressReplacement hide original");
                mx.ui.hideProgressOrig(pid);
                this._hideSpinner(); // We might have a residual spinner, so we trigger this as well.
            } else {
                this.debug("._spinnerHideProgressReplacement not closing this progress, not triggered by plugin");
            }
        },

        _removeMsg: function (id) {
            var index = this._findIndex(this._spinnerMessages, function (msg) { return msg.id === id; });
            if (index !== -1) {
                this._spinnerMessages.splice(index, 1);
            }
        }
    });
});

},
'MobileFeatures/widget/plugins/dialog':function(){
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
], function(declare, lang) {
    "use strict";

    return declare("MobileFeatures.widget.plugin.dialog", [], {

        // Set in modeler
        dialogEnabled: true,

        _enableDialog: function() {
            this.debug("._enableDialog");
            if (navigator && navigator.notification && (typeof mx.ui.mobileDialogLoaded === "undefined" || mx.ui.mobileDialogLoaded === null || mx.ui.mobileDialogLoaded === false)) {
                mx.ui.mobileDialogLoaded = true;
                mx.ui.confirmation = lang.hitch(this, this._confirmationReplacement);

                mx.ui.info = lang.hitch(this, this._infoReplacement);
                mx.ui.warning = lang.hitch(this, this._warningReplacement);
                mx.ui.error = lang.hitch(this, this._errorReplacement);

            } else if (mx.ui.mobileDialogLoaded === true) {
                this.debug("._enableDialog not loaded, already enabled");
            } else {
                console.warn(this.id + "._enableDialog dialog not enabled. Either already enabled or 'cordova-plugin-dialogs' plugin missing in Phonegap");
            }
        },

        _confirmationReplacement: function(args) {
            this.debug("._confirmationReplacement");
            navigator.notification.confirm(args.content, function(buttonNum) {
                if (buttonNum === 1) {
                    args.handler();
                    //Extra argument so other widgets can get a callback on the cancel button too
                } else if (buttonNum === 2) {
                    if (window.plugins && window.plugins.nativepagetransitions) {
                        window.plugins.nativepagetransitions.cancelPendingTransition(function(msg) {
                            //console.log("success: " + msg)
                        }); // called when the screenshot was hidden (almost instantly)
                    }
                    if (args.handlerCancel) {
                        args.handlerCancel();
                    }
                }
            }, "Confirm", [args.proceed, args.cancel]);
        },

        _infoReplacement: function(msg, modal) {
            navigator.notification.alert(msg, null, "Info");
        },
        _warningReplacement: function(msg, modal) {
            navigator.notification.alert(msg, null, "Warning");
        },
        _errorReplacement: function(msg, modal) {
            navigator.notification.alert(msg, null, "Error");
        }

    });
});

},
'MobileFeatures/widget/plugins/transitions':function(){
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/ready",
    "dojo/aspect",
    "dojo/_base/array",
    "dojo/query"
], function(declare, lang, on, ready, aspect, array, query) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileFeatures.widget.plugin.transitions", [], {

        transitionsEnabled: false,
        fixedPixelsTop: 0,
        fixedPixelsBottom: 0,
        transitionBeforePosition: "onNavigation",    // Set in Modeler in 'Advanced'
        onPauseTransitionTimeout: 10,                // Set in Modeler in 'Advanced'

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _transitionListenerHandlers: [],
        _transitionObserver: null,
        _pendingTimeout: null,
        _onNavigateTo: null,
        _onNavigation: null,
        _aroundNavigation: null,
        _onPauseListener: null,
        _onResumeListener: null,
        _paused: false,

        _enableTransitions: function() {
            this.debug("transitions._enableTransitions");

            ready(lang.hitch(this, this._setupMutationObserver));

            if (this.transitionBeforePosition === "onPersistViewChange") {
                this._aroundNavigation = aspect.around(this.mxform, "onPersistViewState", lang.hitch(this, function (onPersistViewState) {
                    return lang.hitch(this, function () {
                        var args = arguments;
                        this.sequence([
                            function(cb) {
                                setTimeout(cb, 1); // We're setting a timeout so the ui has set the actions in the "onClick"
                            },
                            function(cb) {
                                this.debug("onPersistViewState seq 1");
                                this._prepTransition();
                                setTimeout(cb, 1);
                            },
                            function(cb) {
                                this.debug("onPersistViewState seq 2");
                                onPersistViewState.apply(this, args);
                                setTimeout(cb, 1);
                            },
                            function(cb) {
                                this.debug("onPersistViewState seq 3");
                                this._fireTransition();
                                setTimeout(cb, 1);
                            },
                        ], function () {
                            this.debug("transition fired");
                        });
                    });
                }));
            } else {
                this._onNavigateTo = aspect.before(this.mxform, "onNavigation", lang.hitch(this, this._prepTransition));
                this._onNavigation = aspect.after(this.mxform, "onNavigation", lang.hitch(this, this._fireTransition));
            }

            this._onPauseListener = this.connect(document, "pause", lang.hitch(this, this._onPause));
            this._onResumeListener = this.connect(document, "resume", lang.hitch(this, this._onResume));
        },

        _onPause: function() {
            this.debug(this.id + "._onPause");
            setTimeout(lang.hitch(this, function () {
                this._paused = true;
                this._cancelTransition();
            }), this.onPauseTransitionTimeout);
        },

        _onResume: function() {
            this.debug(this.id + "._onResume");
            this._paused = false;
        },

        _disconnectListeners: function () {
            if (this._transitionListenerHandlers.length > 0) {
                array.forEach(this._transitionListenerHandlers, function (handle) {
                    if (handle.length > 0) {
                        array.forEach(handle, function (subhandle) {
                            subhandle.remove();
                        });
                    }
                });
            }
            this._transitionListenerHandlers = [];
        },

        _cleanupTransitions: function() {
            this.debug("transitions._cleanupTransitions");
            if (this._transitionObserver) {
                this._transitionObserver.disconnect();
            }
            this._onNavigateTo && this._onNavigateTo.remove();
            this._onNavigation && this._onNavigation.remove();
            this._aroundNavigation && this._aroundNavigation.remove();

            this._onPauseListener && this._onPauseListener.remove();
            this._onResumeListener && this._onResumeListener.remove();

            if (this._pendingTimeout) {
                clearTimeout(this._pendingTimeout);
            }
            //Disconnect any listeners
            this._disconnectListeners();
        },

        _setupMutationObserver: function() {
            this.debug("transitions._setupMutationObserver");
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            this._transitionObserver = new MutationObserver(lang.hitch(this, this._setupListeners));

            // define what element should be observed by the observer
            // and what types of mutations trigger the callback
            this._transitionObserver.observe(document, {
                subtree: true,
                childList: true,
                attributes: false,
                characterData: false,
                attributeOldValue: false,
                characterDataOldValue: false
            });

            this._setupListeners();
        },

        _setupListeners: function() {
            this.debug("transitions._setupListeners");
            this._disconnectListeners();
            if (typeof window.plugins !== "undefined" && typeof window.plugins.nativepagetransitions !== "undefined") {
                // Setup handlers here
                this._addTransition(this.classTransitionSU, "slide", this.duration, "up");
                this._addTransition(this.classTransitionSR, "slide", this.duration, "right");
                this._addTransition(this.classTransitionSD, "slide", this.duration, "down");
                this._addTransition(this.classTransitionSL, "slide", this.duration, "left");
                this._addTransition(this.classTransitionFU, "flip", this.duration, "up");
                this._addTransition(this.classTransitionFR, "flip", this.duration, "right");
                this._addTransition(this.classTransitionFD, "flip", this.duration, "down");
                this._addTransition(this.classTransitionFL, "flip", this.duration, "left");
                this._addTransition(this.classTransitionFade, "fade", this.duration);
            } else {
                console.warn(this.id + "._setupListeners: page transition plugin not found");
            }
        },

        _addTransition: function (className, transitionType, duration, direction) {
            var handle = null,
                elements =  query("." + className);

            if (elements.length === 0) {
                return;
            } else {
                this.debug("transitions._addTransition " + className + " " + elements.length + " found");
            }

            if (transitionType === "fade") {

                handle = elements.on("click", lang.hitch(this, function() {
                    this.debug(this.id + " click transition " + transitionType);
                    window.plugins.nativepagetransitions.nextTransition = transitionType;
                    window.plugins.nativepagetransitions.nextOptions = {
                        "duration": duration, // in milliseconds (ms), default 400
                        "iosdelay": -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
                        "androiddelay": -1
                    };
                }));

            } else if (transitionType === "slide") {

                handle = elements.on("click", lang.hitch(this, function() {
                    this.debug(this.id + " click transition " + transitionType + " " + direction);
                    window.plugins.nativepagetransitions.nextTransition = transitionType;
                    window.plugins.nativepagetransitions.nextOptions = {
                        "direction": direction, // "left|right|up|down", default "left" (which is like "next")
                        "duration": duration, // in milliseconds (ms), default 400
                        "slowdownfactor": 2, // overlap views (higher number is more) or no overlap (1), default 4
                        "iosdelay": -1, //defer transitions until they"re called later ////60, // ms to wait for the iOS webview to update before animation kicks in, default 60
                        "androiddelay": -1, //defer transitions until they"re called later ////70 // same as above but for Android, default 70
                        "winphonedelay": 200, // same as above but for Windows Phone, default 200,
                        "fixedPixelsTop": this.fixedPixelsTop, // the number of pixels of your fixed header, default 0 (iOS and Android)
                        "fixedPixelsBottom": this.fixedPixelsBottom // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
                    };
                }));

            } else if (transitionType === "flip") {

                handle = elements.on("click", lang.hitch(this, function() {
                    this.debug(this.id + " click transition " + transitionType + " " + direction);
                    window.plugins.nativepagetransitions.nextTransition = transitionType;
                    window.plugins.nativepagetransitions.nextOptions = {
                        "direction": direction, // "left|right|up|down", default "left" (which is like "next")
                        "duration": duration, // in milliseconds (ms), default 400
                        "iosdelay": -1, //defer transitions until they"re called later ////60, // ms to wait for the iOS webview to update before animation kicks in, default 60
                        "androiddelay": -1, //defer transitions until they"re called later ////70 // same as above but for Android, default 70
                        "winphonedelay": 200, // same as above but for Windows Phone, default 200,
                    };
                }));

            }

            if (handle !== null) {
                this._transitionListenerHandlers.push(handle);
            }
        },

        _prepTransition: function(deferred) {
            this.debug("transitions._prepTransition");
            //instead of setting up a pending when a button is clicked, we're just going to leave options on the plugin object, then prep it before onNavigation.
            //Then we'll call the actual animation after onNavigation
            //This should solve a bunch of problems with taking a screenshot too early, and covering up things like errors

            if (window.plugins && typeof window.plugins.nativepagetransitions !== "undefined" && window.plugins.nativepagetransitions.nextTransition) {
                //clean up any pending transitions, in case they didn't get fired yet.
                //Otherwise you can mess up the plugin by creating 2 screenshots and one of them never gets removed
                this._cancelTransition();

                var transitionType = window.plugins.nativepagetransitions.nextTransition;
                window.plugins.nativepagetransitions[transitionType](
                    window.plugins.nativepagetransitions.nextOptions,
                    lang.hitch(this, function(msg) {
                        this.debug("transitions._prepped", msg);
                    }), // called when the animation has finished
                    lang.hitch(this, function(msg) {
                        this.debug("transitions._prepped error", msg);
                        alert("error: " + msg);
                    }) // called in case you pass in weird valuesyou pass in weird values
                );

                window.plugins.nativepagetransitions.nextTransition = null;
                window.plugins.nativepagetransitions.nextOptions = null;
                //set a limit on how long we're going to keep the transition waiting, in case something breaks
                this._pendingTimeout = setTimeout(lang.hitch(this, this._cancelTransition), 10000);
            }

            return deferred;
        },

        _fireTransition: function(deferred) {
            this.debug("transitions._fireTransition");
            //Cancel a pending cancel transition timeout
            clearTimeout(this._pendingTimeout);

            //Run whatever pending transition is waiting
            if (window.plugins && typeof window.plugins.nativepagetransitions !== "undefined") {
                window.plugins.nativepagetransitions.executePendingTransition(
                    lang.hitch(this, function(msg) {
                        this.debug("transitions.executePendingTransition", msg);
                    }), // called when the animation has finished
                    lang.hitch(this, function(msg) {
                        this.debug("transitions.executePendingTransition error", msg);
                        alert("error: " + msg);
                    }) // called in case you pass in weird values
                );
            }

            return deferred;
        },

        _cancelTransition: function() {
            this.debug("transitions._cancelTransition");
            window.plugins.nativepagetransitions.cancelPendingTransition(
                lang.hitch(this, function(msg) {
                    this.debug("transitions.cancelPendingTransition", msg);
                }) // called when the screenshot was hidden (almost instantly)
            );
        }
    });
});

},
'MobileFeatures/widget/plugins/classes':function(){
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/ready",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/_base/window",
    "dojo/_base/array",
    "dojo/query",
    "dojo/NodeList-data"
], function(declare, lang, on, ready, attr, dojoClass, win, array, query) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileFeatures.widget.plugin.classes", [], {

        classOnline: "app-online",
        classOffline: "app-offline",
        classAndroid: "app-android",
        classIOS: "app-ios",

        _transitionClassesObserver: null,

        _enableClasses: function() {
            this.debug("._enableClasses");

            ready(lang.hitch(this, this._setupClassesMutationObserver));

            // Platform
            if (typeof device !== "undefined" && device.platform) {
                var platform = device.platform.toLowerCase().trim();
                if  (platform === "android") {
                    dojoClass.toggle(win.body(), this.classAndroid, true);
                } else if (platform === "ios") {
                    dojoClass.toggle(win.body(), this.classIOS, true);
                } else {
                    console.warn(this.id + "._enableClasses: unknown platform: " + platform);
                }
            } else {
                console.warn(this.id + "._enableClasses: cannot determine platform");
            }

            // Connection
            if (navigator.connection && typeof Connection !== "undefined") {
                this._enableConnectionDetection();
            } else {
                console.warn(this.id + "._enableClasses: cannot set connection classes");
            }

        },

        _setupClassesMutationObserver: function() {
            this.debug("._setupClassesMutationObserver");
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            this._transitionClassesObserver = new MutationObserver(lang.hitch(this, this._setupClassListeners));

            // define what element should be observed by the observer
            // and what types of mutations trigger the callback
            this._transitionClassesObserver.observe(document, {
                subtree: true,
                childList: true,
                attributes: false,
                characterData: false,
                attributeOldValue: false,
                characterDataOldValue: false
            });

            this._setupClassListeners();
        },

        _setupClassListeners: function() {
            this._setTypes(this.classNumeric, "number");
        },

        _setTypes: function(formClass, type) {
            var handle = null,
                elements =  query("." + formClass + " input[type=text]");

            if (elements.length === 0) {
                return;
            } else {
                this.debug("._setTypes " + formClass + " " + elements.length + " found");
            }

            array.forEach(elements, lang.hitch(this, function (element, index) {
                attr.set(element, "type", type);
            }));
        },

        _enableConnectionDetection: function () {
            this._toggleStatus(true);
            document.addEventListener("offline", lang.hitch(this, this._onOffline), false);
            document.addEventListener("online", lang.hitch(this, this._onOnline), false);
        },

        _toggleStatus: function (online) {
            dojoClass.toggle(win.body(), this.classOnline, online);
            dojoClass.toggle(win.body(), this.classOffline, !online);
        },

        _onOnline: function () {
            var networkState = navigator.connection.type;
            this._toggleStatus(networkState && networkState !== Connection.NONE);
        },

        _onOffline: function () {
            this._toggleStatus(false);
        },

        _disableClasses: function () {
            this.debug("._disableClasses");
            if (this._transitionClassesObserver) {
                this._transitionClassesObserver.disconnect();
            }
        }
    });
});

},
'dojo/NodeList-data':function(){
define([
	"./_base/kernel", "./query", "./_base/lang", "./_base/array", "./dom-attr"
], function(dojo, query, lang, array, attr){

	// module:
	//		dojo/NodeList-data

	/*=====
	return function(){
		// summary:
		//		Adds data() and removeData() methods to NodeList, and returns NodeList constructor.
	};
	=====*/

	var NodeList = query.NodeList;

	var dataCache = {}, x = 0, dataattr = "data-dojo-dataid",
		dopid = function(node){
			// summary:
			//		Return a uniqueish ID for the passed node reference
			var pid = attr.get(node, dataattr);
			if(!pid){
				pid = "pid" + (x++);
				attr.set(node, dataattr, pid);
			}
			return pid;
		}
	;

	
	var dodata = dojo._nodeData = function(node, key, value){
		// summary:
		//		Private helper for dojo/NodeList.data for single node data access. Refer to NodeList.data
		//		documentation for more information.
		//
		// node: String|DomNode
		//		The node to associate data with
		//
		// key: Object|String?
		//		If an object, act as a setter and iterate over said object setting data items as defined.
		//		If a string, and `value` present, set the data for defined `key` to `value`
		//		If a string, and `value` absent, act as a getter, returning the data associated with said `key`
		//
		// value: Anything?
		//		The value to set for said `key`, provided `key` is a string (and not an object)
		//
		var pid = dopid(node), r;
		if(!dataCache[pid]){ dataCache[pid] = {}; }

		// API discrepency: calling with only a node returns the whole object. $.data throws
		if(arguments.length == 1){ return dataCache[pid]; }
		if(typeof key == "string"){
			// either getter or setter, based on `value` presence
			if(arguments.length > 2){
				dataCache[pid][key] = value;
			}else{
				r = dataCache[pid][key];
			}
		}else{
			// must be a setter, mix `value` into data hash
			// API discrepency: using object as setter works here
			r = lang.mixin(dataCache[pid], key);
		}

		return r; // Object|Anything|Nothing
	};

	var removeData = dojo._removeNodeData = function(node, key){
		// summary:
		//		Remove some data from this node
		// node: String|DomNode
		//		The node reference to remove data from
		// key: String?
		//		If omitted, remove all data in this dataset.
		//		If passed, remove only the passed `key` in the associated dataset
		var pid = dopid(node);
		if(dataCache[pid]){
			if(key){
				delete dataCache[pid][key];
			}else{
				delete dataCache[pid];
			}
		}
	};

	NodeList._gcNodeData = dojo._gcNodeData = function(){
		// summary:
		//		super expensive: GC all data in the data for nodes that no longer exist in the dom.
		// description:
		//		super expensive: GC all data in the data for nodes that no longer exist in the dom.
		//		MUCH safer to do this yourself, manually, on a per-node basis (via `NodeList.removeData()`)
		//		provided as a stop-gap for exceptionally large/complex applications with constantly changing
		//		content regions (eg: a dijit/layout/ContentPane with replacing data)
		//		There is NO automatic GC going on. If you dojo.destroy() a node, you should _removeNodeData
		//		prior to destruction.
		var livePids = query("[" + dataattr + "]").map(dopid);
		for(var i in dataCache){
			if(array.indexOf(livePids, i) < 0){ delete dataCache[i]; }
		}
	};

	// make nodeData and removeNodeData public on dojo/NodeList:
	lang.extend(NodeList, {
		data: NodeList._adaptWithCondition(dodata, function(a){
			return a.length === 0 || a.length == 1 && (typeof a[0] == "string");
		}),
		removeData: NodeList._adaptAsForEach(removeData)
	});

	/*=====
	 lang.extend(NodeList, {
		 data: function(key, value){
			// summary:
			//		stash or get some arbitrary data on/from these nodes.
			//
			// description:
			//		Stash or get some arbitrary data on/from these nodes. This private _data function is
			//		exposed publicly on `dojo/NodeList`, eg: as the result of a `dojo/query` call.
			//		DIFFERS from jQuery.data in that when used as a getter, the entire list is ALWAYS
			//		returned. EVEN WHEN THE LIST IS length == 1.
			//
			//		A single-node version of this function is provided as `dojo._nodeData`, which follows
			//		the same signature, though expects a String ID or DomNode reference in the first
			//		position, before key/value arguments.
			//
			// node: String|DomNode
			//		The node to associate data with
			//
			// key: Object|String?
			//		If an object, act as a setter and iterate over said object setting data items as defined.
			//		If a string, and `value` present, set the data for defined `key` to `value`
			//		If a string, and `value` absent, act as a getter, returning the data associated with said `key`
			//
			// value: Anything?
			//		The value to set for said `key`, provided `key` is a string (and not an object)
			//
			// example:
			//		Set a key `bar` to some data, then retrieve it.
			//	|	require(["dojo/query", "dojo/NodeList-data"], function(query){
			//	|		query(".foo").data("bar", "touched");
			//	|		var touched = query(".foo").data("bar");
			//	|		if(touched[0] == "touched"){ alert('win'); }
			//	|	});
			//
			// example:
			//		Get all the data items for a given node.
			//	|	require(["dojo/query", "dojo/NodeList-data"], function(query){
			//	|		var list = query(".foo").data();
			//	|		var first = list[0];
			//	|	});
			//
			// example:
			//		Set the data to a complex hash. Overwrites existing keys with new value
			//	|	require(["dojo/query", "dojo/NodeList-data"], function(query){
			//	|		query(".foo").data({ bar:"baz", foo:"bar" });
			//		Then get some random key:
			//	|		query(".foo").data("foo"); // returns [`bar`]
			//	|	});
			//
			// returns: Object|Anything|Nothing
			//		When used as a setter via `dojo/NodeList`, a NodeList instance is returned
			//		for further chaining. When used as a getter via `dojo/NodeList` an ARRAY
			//		of items is returned. The items in the array correspond to the elements
			//		in the original list. This is true even when the list length is 1, eg:
			//		when looking up a node by ID (#foo)
		 },

		 removeData: function(key){
			// summary:
			//		Remove the data associated with these nodes.
			// key: String?
			//		If omitted, clean all data for this node.
			//		If passed, remove the data item found at `key`
		 }
	 });
	 =====*/

// TODO: this is the basic implementation of adaptWithConditionAndWhenMappedConsiderLength, for lack of a better API name
// it conflicts with the the `dojo/NodeList` way: always always return an arrayLike thinger. Consider for 2.0:
//
//	NodeList.prototype.data = function(key, value){
//		var a = arguments, r;
//		if(a.length === 0 || a.length == 1 && (typeof a[0] == "string")){
//			r = this.map(function(node){
//				return d._data(node, key);
//			});
//			if(r.length == 1){ r = r[0]; } // the offending line, and the diff on adaptWithCondition
//		}else{
//			r = this.forEach(function(node){
//				d._data(node, key, value);
//			});
//		}
//		return r; // NodeList|Array|SingleItem
//	};

	return NodeList;

});

},
'MobileFeatures/widget/plugins/statusbar':function(){
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/_base/window"
], function(declare, lang, dojoClass, win) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileFeatures.widget.plugin.statusbar", [], {

        statusbarBackgroundColor: "000000",
        statusbarTextColor: "white",
        statusbarShowStatusBar: true,
        statusbarOverlayWebView: true,

        _enableStatusbar: function() {
            this.debug("._enableStatusbar");

            // Platform
            if (typeof StatusBar !== "undefined") {
                if (this.statusbarBackgroundColor && StatusBar.backgroundColorByHexString) {
                    StatusBar.backgroundColorByHexString(this.statusbarBackgroundColor);
                }
                if (this.statusbarTextColor === "white" && StatusBar.styleLightContent) {
                    StatusBar.styleLightContent();
                } else {
                    StatusBar.styleDefault();
                }
                if (this.statusbarShowStatusBar) {
                    StatusBar.show();
                } else {
                    StatusBar.hide();
                }
                if (StatusBar.overlaysWebView) {
                    StatusBar.overlaysWebView(this.statusbarOverlayWebView);
                }
            } else {
                console.warn(this.id + "._enableStatusbar: cannot find StatusBar");
            }
        }
    });
});

},
'MobileFeatures/widget/plugins/customconnectionerror':function(){
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/query"
], function(declare, lang, win, dom, domConstruct, domClass, query) {
    "use strict";

    var ConnectionError = mendix.lib.ConnectionError;

    return declare("MobileFeatures.widget.plugin.CustomConnectionError", [], {

        // Set in modeler
        customConnectionErrorEnabled: false,

        // private
        _timeOut: null,
        _oldError: null,
        _errorBar: null,

        _enableCustomConnectionError: function() {
            this.debug("._enableCustomConnectionError");

            if (!ConnectionError) {
                console.warn(this.id + "Connection Error Replacement: Cannot find mendix.lib.ConnectionError");
                return;
            }

            this._oldError = mx.onError;

            this._errorBar = domConstruct.create("div", {
                "id": "connection-error-bar",
                "class": "hidden"
            }, win.body());

            domConstruct.create("p", {
                "id": "connection-error-bar-message",
                "innerHTML": this.customConnectionErrorMsg,
            }, this._errorBar);

            setTimeout(lang.hitch(this, this._showConnectionError, false), 500);

            mx.onError = lang.hitch(this, function(e) {
                if (e && e instanceof ConnectionError) {

                    this._showConnectionError(true);
                    if (this._timeOut) {
                        clearTimeout(this._timeOut);
                    }

                    this._timeOut = setTimeout(lang.hitch(this, function() {
                        this._showConnectionError(false);
                        this._timeOut = null;
                    }), 2000);

                } else {
                    this._oldError(e);
                }
            });
        },

        _disableCustomConnectionError: function () {
            if (this._oldError) {
                mx.onError = this._oldError;
            }
            domConstruct.destroy(this._errorBar);
        },

        _showConnectionError: function(state) {
            this.debug("._showConnectionError");
            if (this._errorBar) {
                domClass.toggle(this._errorBar, "hidden", false);
                domClass.toggle(this._errorBar, "closed", !state);
                domClass.toggle(this._errorBar, "open", state);
            }
        }
    });
});

},
'MobileFeatures/widget/plugins/advanced':function(){
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-class",
    "dojo/_base/window"
], function(declare, lang, dojoClass, win) {
    "use strict";

    // Declare widget's prototype.
    return declare("MobileFeatures.widget.advanced", [], {

        advancedListViewLazyLoad: true,
        advancedGroupboxLazyLoad: true,

        _enableListViewLazyLoad: function() {
            window.mxui.widget.ListView.prototype.update = function(obj, cb) {
                if (this.class.indexOf("disable-lazy") == -1) {
                    window.setTimeout(function () {
                        this._registerSubscriptions();
                        this._loadData(cb);
                    }.bind(this), 0);
                    if (cb) {
                        cb();
                    }
                } else {
                    this._registerSubscriptions();
                    this._loadData(cb);
                }
            };
        },

        _enableGroupboxLazyLoad: function() {
            window.mxui.widget.GroupBox.prototype.update = function(obj, cb) {
                window.setTimeout(function() {
                    var i = this;
                    function n() {
                        require(["dijit/registry"], function(registry) {
                            i.passContext(registry.findWidgets(i.domNode), cb);
                        });
                    }
                    this._captionTextTemplate ? this._captionTextTemplate.update(obj, n) : n();
                }.bind(this), 0);
                if (cb) {
                    cb();
                }
            };
        }
    });
});

},
'*noref':1}});
define("widgets/widgets", [
"MobileFeatures/widget/MobileFeatures"
], function() {});