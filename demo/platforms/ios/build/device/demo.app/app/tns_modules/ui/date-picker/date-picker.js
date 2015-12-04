var common = require("./date-picker-common");
function onYearPropertyChanged(data) {
    var picker = data.object;
    if (picker.ios) {
        var comps = NSCalendar.currentCalendar().componentsFromDate(NSCalendarUnit.NSCalendarUnitYear | NSCalendarUnit.NSCalendarUnitMonth | NSCalendarUnit.NSCalendarUnitDay, picker.ios.date);
        comps.year = data.newValue;
        picker.ios.setDateAnimated(NSCalendar.currentCalendar().dateFromComponents(comps), false);
    }
}
common.DatePicker.yearProperty.metadata.onSetNativeValue = onYearPropertyChanged;
function onMonthPropertyChanged(data) {
    var picker = data.object;
    if (picker.ios) {
        var comps = NSCalendar.currentCalendar().componentsFromDate(NSCalendarUnit.NSCalendarUnitYear | NSCalendarUnit.NSCalendarUnitMonth | NSCalendarUnit.NSCalendarUnitDay, picker.ios.date);
        comps.month = data.newValue;
        picker.ios.setDateAnimated(NSCalendar.currentCalendar().dateFromComponents(comps), false);
    }
}
common.DatePicker.monthProperty.metadata.onSetNativeValue = onMonthPropertyChanged;
function onDayPropertyChanged(data) {
    var picker = data.object;
    if (picker.ios) {
        var comps = NSCalendar.currentCalendar().componentsFromDate(NSCalendarUnit.NSCalendarUnitYear | NSCalendarUnit.NSCalendarUnitMonth | NSCalendarUnit.NSCalendarUnitDay, picker.ios.date);
        comps.day = data.newValue;
        picker.ios.setDateAnimated(NSCalendar.currentCalendar().dateFromComponents(comps), false);
    }
}
common.DatePicker.dayProperty.metadata.onSetNativeValue = onDayPropertyChanged;
function onMaxDatePropertyChanged(data) {
    var picker = data.object;
    if (picker.ios) {
        var nsDate = NSDate.dateWithTimeIntervalSince1970(data.newValue.getTime() / 1000);
        picker.ios.maximumDate = nsDate;
    }
}
common.DatePicker.maxDateProperty.metadata.onSetNativeValue = onMaxDatePropertyChanged;
function onMinDatePropertyChanged(data) {
    var picker = data.object;
    if (picker.ios) {
        picker.ios.minimumDate = NSDate.dateWithTimeIntervalSince1970(data.newValue.getTime() / 1000);
    }
}
common.DatePicker.minDateProperty.metadata.onSetNativeValue = onMinDatePropertyChanged;
global.moduleMerge(common, exports);
var DatePicker = (function (_super) {
    __extends(DatePicker, _super);
    function DatePicker() {
        _super.call(this);
        this._ios = new UIDatePicker();
        this._ios.datePickerMode = UIDatePickerMode.UIDatePickerModeDate;
        this._changeHandler = UIDatePickerChangeHandlerImpl.initWithOwner(new WeakRef(this));
        this._ios.addTargetActionForControlEvents(this._changeHandler, "valueChanged", UIControlEvents.UIControlEventValueChanged);
    }
    Object.defineProperty(DatePicker.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return DatePicker;
})(common.DatePicker);
exports.DatePicker = DatePicker;
var UIDatePickerChangeHandlerImpl = (function (_super) {
    __extends(UIDatePickerChangeHandlerImpl, _super);
    function UIDatePickerChangeHandlerImpl() {
        _super.apply(this, arguments);
    }
    UIDatePickerChangeHandlerImpl.initWithOwner = function (owner) {
        var impl = UIDatePickerChangeHandlerImpl.new();
        impl._owner = owner;
        return impl;
    };
    UIDatePickerChangeHandlerImpl.prototype.valueChanged = function (sender) {
        var comps = NSCalendar.currentCalendar().componentsFromDate(NSCalendarUnit.NSCalendarUnitYear | NSCalendarUnit.NSCalendarUnitMonth | NSCalendarUnit.NSCalendarUnitDay, sender.date);
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        if (comps.year !== owner.year) {
            owner._onPropertyChangedFromNative(common.DatePicker.yearProperty, comps.year);
        }
        if (comps.month !== owner.month) {
            owner._onPropertyChangedFromNative(common.DatePicker.monthProperty, comps.month);
        }
        if (comps.day !== owner.day) {
            owner._onPropertyChangedFromNative(common.DatePicker.dayProperty, comps.day);
        }
    };
    UIDatePickerChangeHandlerImpl.ObjCExposedMethods = {
        'valueChanged': { returns: interop.types.void, params: [UIDatePicker] }
    };
    return UIDatePickerChangeHandlerImpl;
})(NSObject);
