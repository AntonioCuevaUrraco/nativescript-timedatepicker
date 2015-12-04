var common = require("./switch-common");
var utils = require("utils/utils");
function onCheckedPropertyChanged(data) {
    var swtch = data.object;
    swtch.ios.on = data.newValue;
}
common.Switch.checkedProperty.metadata.onSetNativeValue = onCheckedPropertyChanged;
global.moduleMerge(common, exports);
var SwitchChangeHandlerImpl = (function (_super) {
    __extends(SwitchChangeHandlerImpl, _super);
    function SwitchChangeHandlerImpl() {
        _super.apply(this, arguments);
    }
    SwitchChangeHandlerImpl.initWithOwner = function (owner) {
        var handler = SwitchChangeHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    SwitchChangeHandlerImpl.prototype.valueChanged = function (sender) {
        var owner = this._owner.get();
        if (owner) {
            owner._onPropertyChangedFromNative(common.Switch.checkedProperty, sender.on);
        }
    };
    SwitchChangeHandlerImpl.ObjCExposedMethods = {
        'valueChanged': { returns: interop.types.void, params: [UISwitch] }
    };
    return SwitchChangeHandlerImpl;
})(NSObject);
var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        _super.call(this);
        this._ios = new UISwitch();
        this._handler = SwitchChangeHandlerImpl.initWithOwner(new WeakRef(this));
        this._ios.addTargetActionForControlEvents(this._handler, "valueChanged", UIControlEvents.UIControlEventValueChanged);
    }
    Object.defineProperty(Switch.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Switch.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var nativeSize = this._nativeView.sizeThatFits(CGSizeMake(0, 0));
        this.width = nativeSize.width;
        this.height = nativeSize.height;
        var widthAndState = utils.layout.makeMeasureSpec(nativeSize.width, utils.layout.EXACTLY);
        var heightAndState = utils.layout.makeMeasureSpec(nativeSize.height, utils.layout.EXACTLY);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    return Switch;
})(common.Switch);
exports.Switch = Switch;
