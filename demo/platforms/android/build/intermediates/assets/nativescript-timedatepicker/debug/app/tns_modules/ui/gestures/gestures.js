var common = require("./gestures-common");
var definition = require("ui/gestures");
var view = require("ui/core/view");
var trace = require("trace");
global.moduleMerge(common, exports);
var SWIPE_THRESHOLD = 100;
var SWIPE_VELOCITY_THRESHOLD = 100;
var GesturesObserver = (function (_super) {
    __extends(GesturesObserver, _super);
    function GesturesObserver() {
        _super.apply(this, arguments);
    }
    GesturesObserver.prototype.observe = function (type) {
        var _this = this;
        if (this.target) {
            this.type = type;
            this._onTargetLoaded = function (args) {
                trace.write(_this.target + ".target loaded. android:" + _this.target._nativeView, "gestures");
                _this._attach(_this.target, type);
            };
            this._onTargetUnloaded = function (args) {
                trace.write(_this.target + ".target unloaded. android:" + _this.target._nativeView, "gestures");
                _this._detach();
            };
            this.target.on(view.View.loadedEvent, this._onTargetLoaded);
            this.target.on(view.View.unloadedEvent, this._onTargetUnloaded);
            if (this.target.isLoaded) {
                this._attach(this.target, type);
            }
        }
    };
    GesturesObserver.prototype.disconnect = function () {
        this._detach();
        if (this.target) {
            this.target.off(view.View.loadedEvent, this._onTargetLoaded);
            this.target.off(view.View.unloadedEvent, this._onTargetUnloaded);
            this._onTargetLoaded = null;
            this._onTargetUnloaded = null;
        }
        _super.prototype.disconnect.call(this);
    };
    GesturesObserver.prototype._detach = function () {
        trace.write(this.target + "._detach() android:" + this.target._nativeView, "gestures");
        this._onTouchListener = null;
        this._simpleGestureDetector = null;
        this._scaleGestureDetector = null;
        this._swipeGestureDetector = null;
        this._panGestureDetector = null;
    };
    GesturesObserver.prototype._attach = function (target, type) {
        trace.write(this.target + "._attach() android:" + this.target._nativeView, "gestures");
        this._detach();
        if (type & definition.GestureTypes.tap || type & definition.GestureTypes.doubleTap || type & definition.GestureTypes.longPress) {
            this._simpleGestureDetector = new android.support.v4.view.GestureDetectorCompat(target._context, new TapAndDoubleTapGestureListener(this, this.target, type));
        }
        if (type & definition.GestureTypes.pinch) {
            this._scaleGestureDetector = new android.view.ScaleGestureDetector(target._context, new PinchGestureListener(this, this.target));
        }
        if (type & definition.GestureTypes.swipe) {
            this._swipeGestureDetector = new android.support.v4.view.GestureDetectorCompat(target._context, new SwipeGestureListener(this, this.target));
        }
        if (type & definition.GestureTypes.pan) {
            this._panGestureDetector = new android.support.v4.view.GestureDetectorCompat(target._context, new PanGestureListener(this, this.target));
        }
    };
    GesturesObserver.prototype.androidOnTouchEvent = function (motionEvent) {
        if (this._simpleGestureDetector) {
            this._simpleGestureDetector.onTouchEvent(motionEvent);
        }
        if (this._scaleGestureDetector) {
            this._scaleGestureDetector.onTouchEvent(motionEvent);
        }
        if (this._swipeGestureDetector) {
            this._swipeGestureDetector.onTouchEvent(motionEvent);
        }
        if (this._panGestureDetector) {
            this._panGestureDetector.onTouchEvent(motionEvent);
        }
        if (this.type & definition.GestureTypes.rotation && motionEvent.getPointerCount() === 2) {
            var deltaX = motionEvent.getX(0) - motionEvent.getX(1);
            var deltaY = motionEvent.getY(0) - motionEvent.getY(1);
            var radians = Math.atan(deltaY / deltaX);
            var degrees = radians * (180 / Math.PI);
            var args = {
                type: definition.GestureTypes.rotation,
                view: this.target,
                android: motionEvent,
                rotation: degrees,
                ios: undefined,
                object: this.target,
                eventName: definition.toString(definition.GestureTypes.rotation),
                state: getState(motionEvent)
            };
            if (this.callback) {
                this.callback.call(this.context, args);
            }
        }
    };
    return GesturesObserver;
})(common.GesturesObserver);
exports.GesturesObserver = GesturesObserver;
function getState(e) {
    if (e.getAction() === android.view.MotionEvent.ACTION_DOWN) {
        return common.GestureStateTypes.began;
    }
    else if (e.getAction() === android.view.MotionEvent.ACTION_CANCEL) {
        return common.GestureStateTypes.cancelled;
    }
    else if (e.getAction() === android.view.MotionEvent.ACTION_MOVE) {
        return common.GestureStateTypes.changed;
    }
    else if (e.getAction() === android.view.MotionEvent.ACTION_UP) {
        return common.GestureStateTypes.ended;
    }
}
function _getArgs(type, view, e) {
    return {
        type: type,
        view: view,
        android: e,
        ios: undefined,
        object: view,
        eventName: definition.toString(type),
    };
}
function _getSwipeArgs(direction, view, initialEvent, currentEvent) {
    return {
        type: definition.GestureTypes.swipe,
        view: view,
        android: { initial: initialEvent, current: currentEvent },
        direction: direction,
        ios: undefined,
        object: view,
        eventName: definition.toString(definition.GestureTypes.swipe),
        state: getState(currentEvent)
    };
}
function _getPanArgs(deltaX, deltaY, view, initialEvent, currentEvent) {
    return {
        type: definition.GestureTypes.pan,
        view: view,
        android: { initial: initialEvent, current: currentEvent },
        deltaX: deltaX,
        deltaY: deltaY,
        ios: undefined,
        object: view,
        eventName: definition.toString(definition.GestureTypes.pan),
        state: getState(currentEvent)
    };
}
function _executeCallback(observer, args) {
    if (observer && observer.callback) {
        observer.callback.call(observer._context, args);
    }
}
var TapAndDoubleTapGestureListener = (function (_super) {
    __extends(TapAndDoubleTapGestureListener, _super);
    function TapAndDoubleTapGestureListener(observer, target, type) {
        _super.call(this);
        this._observer = observer;
        this._target = target;
        this._type = type;
        return global.__native(this);
    }
    TapAndDoubleTapGestureListener.prototype.onSingleTapUp = function (motionEvent) {
        if (this._type & definition.GestureTypes.tap) {
            var args = _getArgs(definition.GestureTypes.tap, this._target, motionEvent);
            _executeCallback(this._observer, args);
        }
        return true;
    };
    TapAndDoubleTapGestureListener.prototype.onDoubleTap = function (motionEvent) {
        if (this._type & definition.GestureTypes.doubleTap) {
            var args = _getArgs(definition.GestureTypes.doubleTap, this._target, motionEvent);
            _executeCallback(this._observer, args);
        }
        return true;
    };
    TapAndDoubleTapGestureListener.prototype.onDown = function (motionEvent) {
        return true;
    };
    TapAndDoubleTapGestureListener.prototype.onLongPress = function (motionEvent) {
        if (this._type & definition.GestureTypes.longPress) {
            var args = _getArgs(definition.GestureTypes.longPress, this._target, motionEvent);
            _executeCallback(this._observer, args);
        }
    };
    return TapAndDoubleTapGestureListener;
})(android.view.GestureDetector.SimpleOnGestureListener);
var PinchGestureListener = (function (_super) {
    __extends(PinchGestureListener, _super);
    function PinchGestureListener(observer, target) {
        _super.call(this);
        this._observer = observer;
        this._target = target;
        return global.__native(this);
    }
    PinchGestureListener.prototype.onScale = function (detector) {
        var args = {
            type: definition.GestureTypes.pinch,
            view: this._target,
            android: detector,
            scale: detector.getScaleFactor(),
            object: this._target,
            eventName: definition.toString(definition.GestureTypes.pinch),
            ios: undefined,
            state: common.GestureStateTypes.changed
        };
        _executeCallback(this._observer, args);
        return true;
    };
    PinchGestureListener.prototype.onScaleBegin = function (detector) {
        var args = {
            type: definition.GestureTypes.pinch,
            view: this._target,
            android: detector,
            scale: detector.getScaleFactor(),
            object: this._target,
            eventName: definition.toString(definition.GestureTypes.pinch),
            ios: undefined,
            state: common.GestureStateTypes.began
        };
        _executeCallback(this._observer, args);
        return true;
    };
    PinchGestureListener.prototype.onScaleEnd = function (detector) {
        var args = {
            type: definition.GestureTypes.pinch,
            view: this._target,
            android: detector,
            scale: detector.getScaleFactor(),
            object: this._target,
            eventName: definition.toString(definition.GestureTypes.pinch),
            ios: undefined,
            state: common.GestureStateTypes.ended
        };
        _executeCallback(this._observer, args);
    };
    return PinchGestureListener;
})(android.view.ScaleGestureDetector.SimpleOnScaleGestureListener);
var SwipeGestureListener = (function (_super) {
    __extends(SwipeGestureListener, _super);
    function SwipeGestureListener(observer, target) {
        _super.call(this);
        this._observer = observer;
        this._target = target;
        return global.__native(this);
    }
    SwipeGestureListener.prototype.onDown = function (motionEvent) {
        return true;
    };
    SwipeGestureListener.prototype.onFling = function (initialEvent, currentEvent, velocityX, velocityY) {
        var result = false;
        var args;
        try {
            var deltaY = currentEvent.getY() - initialEvent.getY();
            var deltaX = currentEvent.getX() - initialEvent.getX();
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > SWIPE_THRESHOLD
                    && Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
                    if (deltaX > 0) {
                        args = _getSwipeArgs(definition.SwipeDirection.right, this._target, initialEvent, currentEvent);
                        _executeCallback(this._observer, args);
                        result = true;
                    }
                    else {
                        args = _getSwipeArgs(definition.SwipeDirection.left, this._target, initialEvent, currentEvent);
                        _executeCallback(this._observer, args);
                        result = true;
                    }
                }
            }
            else {
                if (Math.abs(deltaY) > SWIPE_THRESHOLD
                    && Math.abs(velocityY) > SWIPE_VELOCITY_THRESHOLD) {
                    if (deltaY > 0) {
                        args = _getSwipeArgs(definition.SwipeDirection.down, this._target, initialEvent, currentEvent);
                        _executeCallback(this._observer, args);
                        result = true;
                    }
                    else {
                        args = _getSwipeArgs(definition.SwipeDirection.up, this._target, initialEvent, currentEvent);
                        _executeCallback(this._observer, args);
                        result = true;
                    }
                }
            }
        }
        catch (ex) {
        }
        return result;
    };
    return SwipeGestureListener;
})(android.view.GestureDetector.SimpleOnGestureListener);
var PanGestureListener = (function (_super) {
    __extends(PanGestureListener, _super);
    function PanGestureListener(observer, target) {
        _super.call(this);
        this._observer = observer;
        this._target = target;
        return global.__native(this);
    }
    PanGestureListener.prototype.onDown = function (motionEvent) {
        return false;
    };
    PanGestureListener.prototype.onScroll = function (initialEvent, currentEvent, lastDeltaX, lastDeltaY) {
        var deltaX = currentEvent.getX() - initialEvent.getX();
        var deltaY = currentEvent.getY() - initialEvent.getY();
        var args = _getPanArgs(deltaX, deltaY, this._target, initialEvent, currentEvent);
        _executeCallback(this._observer, args);
        return true;
    };
    return PanGestureListener;
})(android.view.GestureDetector.SimpleOnGestureListener);
