var pageCommon = require("./page-common");
var view_1 = require("ui/core/view");
var trace = require("trace");
var uiUtils = require("ui/utils");
var utils = require("utils/utils");
var platform_1 = require("platform");
var enums_1 = require("ui/enums");
global.moduleMerge(pageCommon, exports);
var UIViewControllerImpl = (function (_super) {
    __extends(UIViewControllerImpl, _super);
    function UIViewControllerImpl() {
        _super.apply(this, arguments);
    }
    UIViewControllerImpl.initWithOwner = function (owner) {
        var controller = UIViewControllerImpl.new();
        controller._owner = owner;
        controller.automaticallyAdjustsScrollViewInsets = false;
        return controller;
    };
    UIViewControllerImpl.prototype.viewDidLayoutSubviews = function () {
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        trace.write(owner + " viewDidLayoutSubviews, isLoaded = " + owner.isLoaded, trace.categories.ViewHierarchy);
        if (!owner.isLoaded) {
            return;
        }
        if (owner._isModal) {
            var isTablet = platform_1.device.deviceType === enums_1.DeviceType.Tablet;
            var isFullScreen = !owner._UIModalPresentationFormSheet || !isTablet;
            var frame = isFullScreen ? UIScreen.mainScreen().bounds : this.view.frame;
            var origin = frame.origin;
            var size = frame.size;
            var width = size.width;
            var height = size.height;
            var mode = utils.layout.EXACTLY;
            var superViewRotationRadians;
            if (this.view.superview) {
                var transform = this.view.superview.transform;
                superViewRotationRadians = atan2f(transform.b, transform.a);
            }
            if (utils.ios.MajorVersion < 8 && utils.ios.isLandscape() && !superViewRotationRadians) {
                width = size.height;
                height = size.width;
            }
            var bottom = height;
            var statusBarHeight = uiUtils.ios.getStatusBarHeight();
            var statusBarVisible = !UIApplication.sharedApplication().statusBarHidden;
            var backgroundSpanUnderStatusBar = owner.backgroundSpanUnderStatusBar;
            if (statusBarVisible && !backgroundSpanUnderStatusBar) {
                height -= statusBarHeight;
            }
            var widthSpec = utils.layout.makeMeasureSpec(width, mode);
            var heightSpec = utils.layout.makeMeasureSpec(height, mode);
            view_1.View.measureChild(null, owner, widthSpec, heightSpec);
            var top_1 = ((backgroundSpanUnderStatusBar && isFullScreen) || utils.ios.MajorVersion < 8 || !isFullScreen) ? 0 : statusBarHeight;
            view_1.View.layoutChild(null, owner, 0, top_1, width, bottom);
            if (utils.ios.MajorVersion < 8) {
                if (!backgroundSpanUnderStatusBar && (!isTablet || isFullScreen)) {
                    if (utils.ios.isLandscape() && !superViewRotationRadians) {
                        this.view.center = CGPointMake(this.view.center.x - statusBarHeight, this.view.center.y);
                    }
                    else {
                        this.view.center = CGPointMake(this.view.center.x, this.view.center.y + statusBarHeight);
                    }
                }
            }
            trace.write(owner + ", native frame = " + NSStringFromCGRect(this.view.frame), trace.categories.Layout);
        }
        else {
            owner._updateLayout();
        }
    };
    UIViewControllerImpl.prototype.viewWillAppear = function () {
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        trace.write(owner + " viewWillAppear", trace.categories.Navigation);
        owner._enableLoadedEvents = true;
        if (!owner._isModal) {
            owner._delayLoadedEvent = true;
        }
        owner.onLoaded();
        owner._enableLoadedEvents = false;
    };
    UIViewControllerImpl.prototype.viewDidDisappear = function () {
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        trace.write(owner + " viewDidDisappear", trace.categories.Navigation);
        if (owner.modal) {
            return;
        }
        owner._enableLoadedEvents = true;
        owner.onUnloaded();
        owner._enableLoadedEvents = false;
    };
    return UIViewControllerImpl;
})(UIViewController);
var Page = (function (_super) {
    __extends(Page, _super);
    function Page(options) {
        _super.call(this, options);
        this._isModal = false;
        this._UIModalPresentationFormSheet = false;
        this._ios = UIViewControllerImpl.initWithOwner(new WeakRef(this));
    }
    Page.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        if (!this.parent && this.ios && this._nativeView) {
            this._nativeView.setNeedsLayout();
        }
    };
    Page.prototype._onContentChanged = function (oldView, newView) {
        _super.prototype._onContentChanged.call(this, oldView, newView);
        this._removeNativeView(oldView);
        this._addNativeView(newView);
    };
    Page.prototype.onLoaded = function () {
        if (this._enableLoadedEvents) {
            _super.prototype.onLoaded.call(this);
        }
        this._updateActionBar(false);
    };
    Page.prototype.notify = function (data) {
        if (data.eventName === view_1.View.loadedEvent && this._delayLoadedEvent) {
            return;
        }
        _super.prototype.notify.call(this, data);
    };
    Page.prototype.onUnloaded = function () {
        if (this._enableLoadedEvents) {
            _super.prototype.onUnloaded.call(this);
        }
    };
    Page.prototype._addNativeView = function (view) {
        if (view) {
            trace.write("Native: Adding " + view + " to " + this, trace.categories.ViewHierarchy);
            if (view.ios instanceof UIView) {
                this._ios.view.addSubview(view.ios);
            }
            else if (view.ios instanceof UIViewController) {
                this._ios.addChildViewController(view.ios);
                this._ios.view.addSubview(view.ios.view);
            }
        }
    };
    Page.prototype._removeNativeView = function (view) {
        if (view) {
            trace.write("Native: Removing " + view + " from " + this, trace.categories.ViewHierarchy);
            if (view.ios instanceof UIView) {
                view.ios.removeFromSuperview();
            }
            else if (view.ios instanceof UIViewController) {
                view.ios.removeFromParentViewController();
                view.ios.view.removeFromSuperview();
            }
        }
    };
    Object.defineProperty(Page.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "_nativeView", {
        get: function () {
            return this.ios.view;
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype._showNativeModalView = function (parent, context, closeCallback, fullscreen) {
        _super.prototype._showNativeModalView.call(this, parent, context, closeCallback, fullscreen);
        this._isModal = true;
        if (!parent.ios.view.window) {
            throw new Error("Parent page is not part of the window hierarchy. Close the current modal page before showing another one!");
        }
        if (fullscreen) {
            this._ios.modalPresentationStyle = UIModalPresentationStyle.UIModalPresentationFullScreen;
        }
        else {
            this._ios.modalPresentationStyle = UIModalPresentationStyle.UIModalPresentationFormSheet;
            this._UIModalPresentationFormSheet = true;
        }
        var that = this;
        parent.ios.presentViewControllerAnimatedCompletion(this._ios, false, function completion() {
            that._raiseShownModallyEvent(parent, context, closeCallback);
        });
    };
    Page.prototype._hideNativeModalView = function (parent) {
        this._isModal = false;
        this._UIModalPresentationFormSheet = false;
        parent.requestLayout();
        parent._ios.dismissModalViewControllerAnimated(false);
        _super.prototype._hideNativeModalView.call(this, parent);
    };
    Page.prototype._updateActionBar = function (hidden) {
        var frame = this.frame;
        if (frame) {
            frame._updateActionBar(this);
        }
    };
    Page.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var actionBarWidth = 0;
        var actionBarHeight = 0;
        var statusBarHeight = this.backgroundSpanUnderStatusBar ? uiUtils.ios.getStatusBarHeight() : 0;
        if (this._isModal && this._UIModalPresentationFormSheet && platform_1.device.deviceType === enums_1.DeviceType.Tablet) {
            statusBarHeight = 0;
        }
        if (this.frame && this.frame._getNavBarVisible(this)) {
            var actionBarSize = view_1.View.measureChild(this, this.actionBar, widthMeasureSpec, heightMeasureSpec);
            actionBarWidth = actionBarSize.measuredWidth;
            actionBarHeight = actionBarSize.measuredHeight;
        }
        var heightSpec = utils.layout.makeMeasureSpec(height - actionBarHeight - statusBarHeight, heightMode);
        var result = view_1.View.measureChild(this, this.content, widthMeasureSpec, heightSpec);
        var measureWidth = Math.max(actionBarWidth, result.measuredWidth, this.minWidth);
        var measureHeight = Math.max(result.measuredHeight + actionBarHeight, this.minHeight);
        var widthAndState = view_1.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view_1.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Page.prototype.onLayout = function (left, top, right, bottom) {
        view_1.View.layoutChild(this, this.actionBar, 0, 0, right - left, bottom - top);
        var navigationBarHeight = 0;
        if (this.frame && this.frame._getNavBarVisible(this)) {
            navigationBarHeight = this.actionBar.getMeasuredHeight();
        }
        var statusBarHeight = this.backgroundSpanUnderStatusBar ? uiUtils.ios.getStatusBarHeight() : 0;
        if (this._isModal && this._UIModalPresentationFormSheet && platform_1.device.deviceType === enums_1.DeviceType.Tablet) {
            statusBarHeight = 0;
        }
        view_1.View.layoutChild(this, this.content, 0, navigationBarHeight + statusBarHeight, right - left, bottom - top);
    };
    Page.prototype._addViewToNativeVisualTree = function (view) {
        if (view === this.actionBar) {
            return true;
        }
        return _super.prototype._addViewToNativeVisualTree.call(this, view);
    };
    return Page;
})(pageCommon.Page);
exports.Page = Page;
