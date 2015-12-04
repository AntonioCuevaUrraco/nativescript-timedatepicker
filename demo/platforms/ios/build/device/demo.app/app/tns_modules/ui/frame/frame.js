var frameCommon = require("./frame-common");
var trace = require("trace");
var enums = require("ui/enums");
var utils = require("utils/utils");
var view = require("ui/core/view");
var types = require("utils/types");
var uiUtils = require("ui/utils");
global.moduleMerge(frameCommon, exports);
var ENTRY = "_entry";
var NAV_DEPTH = "_navDepth";
var navDepth = -1;
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._shouldSkipNativePop = false;
        this._ios = new iOSFrame(this);
    }
    Frame.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this._paramToNavigate) {
            this.navigate(this._paramToNavigate);
            this._paramToNavigate = undefined;
        }
    };
    Frame.prototype.navigate = function (param) {
        if (this.isLoaded) {
            _super.prototype.navigate.call(this, param);
        }
        else {
            this._paramToNavigate = param;
        }
    };
    Frame.prototype._navigateCore = function (backstackEntry) {
        var viewController = backstackEntry.resolvedPage.ios;
        if (!viewController) {
            throw new Error("Required page does have an viewController created.");
        }
        navDepth++;
        var animated = false;
        if (this.currentPage) {
            animated = this._getIsAnimatedNavigation(backstackEntry.entry);
        }
        backstackEntry[NAV_DEPTH] = navDepth;
        viewController[ENTRY] = backstackEntry;
        this._navigateToEntry = backstackEntry;
        this._updateActionBar(backstackEntry.resolvedPage);
        if (!this._currentEntry) {
            this._ios.controller.pushViewControllerAnimated(viewController, animated);
            trace.write("Frame<" + this._domId + ">.pushViewControllerAnimated(newController) depth = " + navDepth, trace.categories.Navigation);
            return;
        }
        if (backstackEntry.entry.clearHistory) {
            viewController.navigationItem.hidesBackButton = true;
            var newControllers = NSMutableArray.alloc().initWithCapacity(1);
            newControllers.addObject(viewController);
            this._ios.controller.setViewControllersAnimated(newControllers, animated);
            trace.write("Frame<" + this._domId + ">.setViewControllersAnimated([newController]) depth = " + navDepth, trace.categories.Navigation);
            return;
        }
        if (!this._isEntryBackstackVisible(this._currentEntry)) {
            var newControllers = NSMutableArray.alloc().initWithArray(this._ios.controller.viewControllers);
            if (newControllers.count === 0) {
                throw new Error("Wrong controllers count.");
            }
            viewController.navigationItem.hidesBackButton = this.backStack.length === 0;
            newControllers.removeLastObject();
            newControllers.addObject(viewController);
            this._ios.controller.setViewControllersAnimated(newControllers, animated);
            trace.write("Frame<" + this._domId + ">.setViewControllersAnimated([originalControllers - lastController + newController]) depth = " + navDepth, trace.categories.Navigation);
            return;
        }
        this._ios.controller.pushViewControllerAnimated(viewController, animated);
        trace.write("Frame<" + this._domId + ">.pushViewControllerAnimated(newController) depth = " + navDepth, trace.categories.Navigation);
    };
    Frame.prototype._goBackCore = function (backstackEntry) {
        navDepth = backstackEntry[NAV_DEPTH];
        trace.write("Frame<" + this._domId + ">.popViewControllerAnimated depth = " + navDepth, trace.categories.Navigation);
        if (!this._shouldSkipNativePop) {
            var controller = backstackEntry.resolvedPage.ios;
            var animated = this._getIsAnimatedNavigation(backstackEntry.entry);
            this._navigateToEntry = backstackEntry;
            this._updateActionBar(backstackEntry.resolvedPage);
            this._ios.controller.popToViewControllerAnimated(controller, animated);
        }
    };
    Frame.prototype._updateActionBar = function (page) {
        _super.prototype._updateActionBar.call(this, page);
        var page = page || this.currentPage;
        var newValue = this._getNavBarVisible(page);
        this._ios.showNavigationBar = newValue;
        if (this._ios.controller.navigationBar) {
            this._ios.controller.navigationBar.userInteractionEnabled = this.navigationQueueIsEmpty();
        }
    };
    Frame.prototype._getNavBarVisible = function (page) {
        switch (this._ios.navBarVisibility) {
            case enums.NavigationBarVisibility.always:
                return true;
            case enums.NavigationBarVisibility.never:
                return false;
            case enums.NavigationBarVisibility.auto:
                var newValue;
                if (page && types.isDefined(page.actionBarHidden)) {
                    newValue = !page.actionBarHidden;
                }
                else {
                    newValue = this.backStack.length > 0 || (page && page.actionBar && !page.actionBar._isEmpty());
                }
                newValue = !!newValue;
                return newValue;
        }
    };
    Object.defineProperty(Frame.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "_nativeView", {
        get: function () {
            return this._ios.controller.view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame, "defaultAnimatedNavigation", {
        get: function () {
            return frameCommon.Frame.defaultAnimatedNavigation;
        },
        set: function (value) {
            frameCommon.Frame.defaultAnimatedNavigation = value;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        var window = this._nativeView.window;
        if (window) {
            window.setNeedsLayout();
        }
    };
    Frame.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        this._widthMeasureSpec = widthMeasureSpec;
        this._heightMeasureSpec = heightMeasureSpec;
        var result = this.measurePage(this.currentPage);
        var widthAndState = view.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Frame.prototype.measurePage = function (page) {
        var heightSpec = this._heightMeasureSpec;
        if (page && !page.backgroundSpanUnderStatusBar) {
            var height = utils.layout.getMeasureSpecSize(this._heightMeasureSpec);
            var heightMode = utils.layout.getMeasureSpecMode(this._heightMeasureSpec);
            var statusBarHeight = uiUtils.ios.getStatusBarHeight();
            heightSpec = utils.layout.makeMeasureSpec(height - statusBarHeight, heightMode);
        }
        return view.View.measureChild(this, page, this._widthMeasureSpec, heightSpec);
    };
    Frame.prototype.onLayout = function (left, top, right, bottom) {
        this._layoutWidth = right - left;
        this._layoutheight = bottom - top;
        this.layoutPage(this.currentPage);
    };
    Frame.prototype.layoutPage = function (page) {
        var statusBarHeight = (page && !page.backgroundSpanUnderStatusBar) ? uiUtils.ios.getStatusBarHeight() : 0;
        view.View.layoutChild(this, page, 0, statusBarHeight, this._layoutWidth, this._layoutheight);
    };
    Object.defineProperty(Frame.prototype, "navigationBarHeight", {
        get: function () {
            var navigationBar = this._ios.controller.navigationBar;
            return (navigationBar && !this._ios.controller.navigationBarHidden) ? navigationBar.frame.size.height : 0;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._setNativeViewFrame = function (nativeView, frame) {
        if (nativeView.frame.size.width === frame.size.width && nativeView.frame.size.height === frame.size.height) {
            return;
        }
        _super.prototype._setNativeViewFrame.call(this, nativeView, frame);
    };
    return Frame;
})(frameCommon.Frame);
exports.Frame = Frame;
var UINavigationControllerImpl = (function (_super) {
    __extends(UINavigationControllerImpl, _super);
    function UINavigationControllerImpl() {
        _super.apply(this, arguments);
    }
    UINavigationControllerImpl.initWithOwner = function (owner) {
        var controller = UINavigationControllerImpl.new();
        controller._owner = owner;
        return controller;
    };
    Object.defineProperty(UINavigationControllerImpl.prototype, "owner", {
        get: function () {
            return this._owner.get();
        },
        enumerable: true,
        configurable: true
    });
    UINavigationControllerImpl.prototype.viewDidLoad = function () {
        var owner = this._owner.get();
        if (owner) {
            owner.onLoaded();
        }
    };
    UINavigationControllerImpl.prototype.viewDidLayoutSubviews = function () {
        var owner = this._owner.get();
        if (owner) {
            trace.write(this._owner + " viewDidLayoutSubviews, isLoaded = " + owner.isLoaded, trace.categories.ViewHierarchy);
            owner._updateLayout();
        }
    };
    UINavigationControllerImpl.prototype.navigationControllerWillShowViewControllerAnimated = function (navigationController, viewController, animated) {
        var frame = this._owner.get();
        if (!frame) {
            return;
        }
        var newEntry = viewController[ENTRY];
        var newPage = newEntry.resolvedPage;
        if (!newPage.parent) {
            if (!frame._currentEntry) {
                frame._currentEntry = newEntry;
            }
            else {
                frame._navigateToEntry = newEntry;
            }
            frame._addView(newPage);
            frame.measurePage(newPage);
            frame.layoutPage(newPage);
        }
        else if (newPage.parent !== frame) {
            throw new Error("Page is already shown on another frame.");
        }
        newPage.actionBar.update();
    };
    UINavigationControllerImpl.prototype.navigationControllerDidShowViewControllerAnimated = function (navigationController, viewController, animated) {
        var frame = this._owner.get();
        if (!frame) {
            return;
        }
        var newEntry = viewController[ENTRY];
        var newPage = newEntry.resolvedPage;
        if (!newPage._delayLoadedEvent) {
            return;
        }
        var backStack = frame.backStack;
        var currentEntry = backStack.length > 0 ? backStack[backStack.length - 1] : null;
        var isBack = currentEntry && newEntry === currentEntry;
        var currentNavigationContext;
        var navigationQueue = frame._navigationQueue;
        for (var i = 0; i < navigationQueue.length; i++) {
            if (navigationQueue[i].entry === newEntry) {
                currentNavigationContext = navigationQueue[i];
                break;
            }
        }
        var isBackNavigation = currentNavigationContext ? currentNavigationContext.isBackNavigation : false;
        if (isBack) {
            try {
                frame._shouldSkipNativePop = true;
                frame.goBack();
            }
            finally {
                frame._shouldSkipNativePop = false;
            }
        }
        var page = frame.currentPage;
        if (page && !navigationController.viewControllers.containsObject(page.ios)) {
            frame._removeView(page);
        }
        frame._navigateToEntry = null;
        frame._currentEntry = newEntry;
        frame.measurePage(newPage);
        frame.layoutPage(newPage);
        newPage._delayLoadedEvent = false;
        newPage._emit(view.View.loadedEvent);
        frame._updateActionBar(newPage);
        newPage.onNavigatedTo(isBack || isBackNavigation);
        frame._processNavigationQueue(newPage);
    };
    UINavigationControllerImpl.prototype.supportedInterfaceOrientation = function () {
        return UIInterfaceOrientationMask.UIInterfaceOrientationMaskAll;
    };
    UINavigationControllerImpl.ObjCProtocols = [UINavigationControllerDelegate];
    return UINavigationControllerImpl;
})(UINavigationController);
var iOSFrame = (function () {
    function iOSFrame(owner) {
        this._controller = UINavigationControllerImpl.initWithOwner(new WeakRef(owner));
        this._controller.delegate = this._controller;
        this._controller.automaticallyAdjustsScrollViewInsets = false;
        this._navBarVisibility = enums.NavigationBarVisibility.auto;
    }
    Object.defineProperty(iOSFrame.prototype, "controller", {
        get: function () {
            return this._controller;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(iOSFrame.prototype, "showNavigationBar", {
        get: function () {
            return this._showNavigationBar;
        },
        set: function (value) {
            var change = this._showNavigationBar !== value;
            this._showNavigationBar = value;
            this._controller.navigationBarHidden = !value;
            var owner = this._controller.owner;
            if (owner && change) {
                owner.requestLayout();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(iOSFrame.prototype, "navBarVisibility", {
        get: function () {
            return this._navBarVisibility;
        },
        set: function (value) {
            this._navBarVisibility = value;
        },
        enumerable: true,
        configurable: true
    });
    return iOSFrame;
})();
