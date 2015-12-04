var common = require("./segmented-bar-common");
var types = require("utils/types");
var color = require("color");
global.moduleMerge(common, exports);
function onSelectedIndexPropertyChanged(data) {
    var view = data.object;
    if (!view.ios || !view.items) {
        return;
    }
    var index = data.newValue;
    if (types.isNumber(index)) {
        if (index >= 0 && index <= view.items.length - 1) {
            view.ios.selectedSegmentIndex = index;
        }
        else {
            view.selectedIndex = undefined;
            throw new Error("selectedIndex should be between [0, items.length - 1]");
        }
        var args = { eventName: SegmentedBar.selectedIndexChangedEvent, object: view, oldIndex: data.oldValue, newIndex: data.newValue };
        view.notify(args);
    }
}
common.SegmentedBar.selectedIndexProperty.metadata.onSetNativeValue = onSelectedIndexPropertyChanged;
function onItemsPropertyChanged(data) {
    var view = data.object;
    if (!view.ios) {
        return;
    }
    var oldItems = data.oldValue;
    if (oldItems && oldItems.length) {
        for (var i = 0; i < oldItems.length; i++) {
            oldItems[i]._parent = null;
        }
    }
    view._adjustSelectedIndex(newItems);
    view.ios.removeAllSegments();
    var newItems = data.newValue;
    if (newItems && newItems.length) {
        for (var i = 0; i < newItems.length; i++) {
            view.ios.insertSegmentWithTitleAtIndexAnimated(newItems[i].title || "", i, false);
            newItems[i]._parent = view;
        }
        if (view.ios.selectedSegmentIndex !== view.selectedIndex) {
            view.ios.selectedSegmentIndex = view.selectedIndex;
        }
    }
}
common.SegmentedBar.itemsProperty.metadata.onSetNativeValue = onItemsPropertyChanged;
function onSelectedBackgroundColorPropertyChanged(data) {
    var view = data.object;
    if (!view.ios) {
        return;
    }
    if (data.newValue instanceof color.Color) {
        view.ios.tintColor = data.newValue.ios;
    }
}
common.SegmentedBar.selectedBackgroundColorProperty.metadata.onSetNativeValue = onSelectedBackgroundColorPropertyChanged;
var SegmentedBarItem = (function (_super) {
    __extends(SegmentedBarItem, _super);
    function SegmentedBarItem() {
        _super.apply(this, arguments);
    }
    SegmentedBarItem.prototype._update = function () {
        if (this._parent) {
            var tabIndex = this._parent.items.indexOf(this);
            this._parent.ios.setTitleForSegmentAtIndex(this.title || "", tabIndex);
        }
    };
    return SegmentedBarItem;
})(common.SegmentedBarItem);
exports.SegmentedBarItem = SegmentedBarItem;
var SegmentedBar = (function (_super) {
    __extends(SegmentedBar, _super);
    function SegmentedBar() {
        _super.call(this);
        this._ios = UISegmentedControl.new();
        this._selectionHandler = SelectionHandlerImpl.initWithOwner(new WeakRef(this));
        this._ios.addTargetActionForControlEvents(this._selectionHandler, "selected", UIControlEvents.UIControlEventValueChanged);
    }
    Object.defineProperty(SegmentedBar.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return SegmentedBar;
})(common.SegmentedBar);
exports.SegmentedBar = SegmentedBar;
var SelectionHandlerImpl = (function (_super) {
    __extends(SelectionHandlerImpl, _super);
    function SelectionHandlerImpl() {
        _super.apply(this, arguments);
    }
    SelectionHandlerImpl.initWithOwner = function (owner) {
        var handler = SelectionHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    SelectionHandlerImpl.prototype.selected = function (sender) {
        var owner = this._owner.get();
        if (owner) {
            owner.selectedIndex = sender.selectedSegmentIndex;
        }
    };
    SelectionHandlerImpl.ObjCExposedMethods = {
        "selected": { returns: interop.types.void, params: [UISegmentedControl] }
    };
    return SelectionHandlerImpl;
})(NSObject);
