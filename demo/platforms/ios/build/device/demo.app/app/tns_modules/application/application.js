var appModule = require("./application-common");
var frame = require("ui/frame");
var types = require("utils/types");
var definition = require("application");
var enums = require("ui/enums");
var uiUtils = require("ui/utils");
var fileResolverModule = require("file-system/file-name-resolver");
global.moduleMerge(appModule, exports);
var Responder = (function (_super) {
    __extends(Responder, _super);
    function Responder() {
        _super.apply(this, arguments);
    }
    return Responder;
})(UIResponder);
var Window = (function (_super) {
    __extends(Window, _super);
    function Window() {
        _super.apply(this, arguments);
    }
    Window.prototype.initWithFrame = function (frame) {
        var window = _super.prototype.initWithFrame.call(this, frame);
        if (window) {
            window.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingNone;
        }
        return window;
    };
    Object.defineProperty(Window.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (value) {
            this._content = value;
        },
        enumerable: true,
        configurable: true
    });
    Window.prototype.layoutSubviews = function () {
        uiUtils.ios._layoutRootView(this._content, UIScreen.mainScreen().bounds);
    };
    return Window;
})(UIWindow);
var NotificationObserver = (function (_super) {
    __extends(NotificationObserver, _super);
    function NotificationObserver() {
        _super.apply(this, arguments);
    }
    NotificationObserver.new = function () {
        return _super.new.call(this);
    };
    NotificationObserver.prototype.initWithCallback = function (onReceiveCallback) {
        this._onReceiveCallback = onReceiveCallback;
        return this;
    };
    NotificationObserver.prototype.onReceive = function (notification) {
        this._onReceiveCallback(notification);
    };
    NotificationObserver.ObjCExposedMethods = {
        "onReceive": { returns: interop.types.void, params: [NSNotification] }
    };
    return NotificationObserver;
})(NSObject);
var IOSApplication = (function () {
    function IOSApplication() {
        this._currentOrientation = UIDevice.currentDevice().orientation;
        this._observers = new Array();
        this.addNotificationObserver(UIApplicationDidFinishLaunchingNotification, this.didFinishLaunchingWithOptions.bind(this));
        this.addNotificationObserver(UIApplicationDidBecomeActiveNotification, this.didBecomeActive.bind(this));
        this.addNotificationObserver(UIApplicationDidEnterBackgroundNotification, this.didEnterBackground.bind(this));
        this.addNotificationObserver(UIApplicationWillTerminateNotification, this.willTerminate.bind(this));
        this.addNotificationObserver(UIApplicationDidReceiveMemoryWarningNotification, this.didReceiveMemoryWarning.bind(this));
        this.addNotificationObserver(UIDeviceOrientationDidChangeNotification, this.orientationDidChange.bind(this));
    }
    Object.defineProperty(IOSApplication.prototype, "nativeApp", {
        get: function () {
            return UIApplication.sharedApplication();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IOSApplication.prototype, "delegate", {
        get: function () {
            return this._delegate;
        },
        set: function (value) {
            if (this._delegate !== value) {
                this._delegate = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    IOSApplication.prototype.addNotificationObserver = function (notificationName, onReceiveCallback) {
        var observer = NotificationObserver.new().initWithCallback(onReceiveCallback);
        NSNotificationCenter.defaultCenter().addObserverSelectorNameObject(observer, "onReceive", notificationName, null);
        this._observers.push(observer);
        return observer;
    };
    IOSApplication.prototype.removeNotificationObserver = function (observer, notificationName) {
        var index = this._observers.indexOf(observer);
        if (index >= 0) {
            this._observers.splice(index, 1);
            NSNotificationCenter.defaultCenter().removeObserverNameObject(observer, notificationName, null);
        }
    };
    IOSApplication.prototype.didFinishLaunchingWithOptions = function (notification) {
        this._window = Window.alloc().initWithFrame(UIScreen.mainScreen().bounds);
        this._window.backgroundColor = UIColor.whiteColor();
        if (exports.onLaunch) {
            exports.onLaunch();
        }
        exports.notify({
            eventName: definition.launchEvent,
            object: this,
            ios: notification.userInfo && notification.userInfo.objectForKey("UIApplicationLaunchOptionsLocalNotificationKey") || null
        });
        var topFrame = frame.topmost();
        if (!topFrame) {
            var navParam = definition.mainEntry;
            if (!navParam) {
                navParam = definition.mainModule;
            }
            if (navParam) {
                topFrame = new frame.Frame();
                topFrame.navigate(navParam);
            }
            else {
                throw new Error("A Frame must be used to navigate to a Page.");
            }
        }
        this._window.content = topFrame;
        this.rootController = this._window.rootViewController = topFrame.ios.controller;
        this._window.makeKeyAndVisible();
    };
    IOSApplication.prototype.didBecomeActive = function (notification) {
        if (exports.onResume) {
            exports.onResume();
        }
        exports.notify({ eventName: definition.resumeEvent, object: this, ios: UIApplication.sharedApplication() });
    };
    IOSApplication.prototype.didEnterBackground = function (notification) {
        if (exports.onSuspend) {
            exports.onSuspend();
        }
        exports.notify({ eventName: definition.suspendEvent, object: this, ios: UIApplication.sharedApplication() });
    };
    IOSApplication.prototype.willTerminate = function (notification) {
        if (exports.onExit) {
            exports.onExit();
        }
        exports.notify({ eventName: definition.exitEvent, object: this, ios: UIApplication.sharedApplication() });
    };
    IOSApplication.prototype.didReceiveMemoryWarning = function (notification) {
        if (exports.onLowMemory) {
            exports.onLowMemory();
        }
        exports.notify({ eventName: definition.lowMemoryEvent, object: this, android: undefined, ios: UIApplication.sharedApplication() });
    };
    IOSApplication.prototype.orientationDidChange = function (notification) {
        var orientation = UIDevice.currentDevice().orientation;
        if (this._currentOrientation !== orientation) {
            this._currentOrientation = orientation;
            var newValue;
            switch (orientation) {
                case UIDeviceOrientation.UIDeviceOrientationLandscapeRight:
                case UIDeviceOrientation.UIDeviceOrientationLandscapeLeft:
                    newValue = enums.DeviceOrientation.landscape;
                    break;
                case UIDeviceOrientation.UIDeviceOrientationPortrait:
                case UIDeviceOrientation.UIDeviceOrientationPortraitUpsideDown:
                    newValue = enums.DeviceOrientation.portrait;
                    break;
                default:
                    newValue = enums.DeviceOrientation.unknown;
                    break;
            }
            exports.notify({
                eventName: definition.orientationChangedEvent,
                ios: this,
                newValue: newValue,
                object: this
            });
        }
    };
    return IOSApplication;
})();
var iosApp = new IOSApplication();
exports.ios = iosApp;
global.__onUncaughtError = function (error) {
    if (types.isFunction(exports.onUncaughtError)) {
        exports.onUncaughtError(error);
    }
    definition.notify({ eventName: definition.uncaughtErrorEvent, object: definition.ios, ios: error });
};
var started = false;
exports.start = function () {
    if (!started) {
        started = true;
        appModule.loadCss();
        UIApplicationMain(0, null, null, exports.ios && exports.ios.delegate ? NSStringFromClass(exports.ios.delegate) : NSStringFromClass(Responder));
    }
    else {
        throw new Error("iOS Application already started!");
    }
};
global.__onLiveSync = function () {
    if (!started) {
        return;
    }
    fileResolverModule.clearCache();
    appModule.loadCss();
    frame.reloadPage();
};
