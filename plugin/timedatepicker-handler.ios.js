"use strict";
var applicationModule = require("application");
var _isInit = false;
var _iOSApplication = applicationModule.ios;
var mPickerManager;
var MyDelegate = (function (_super) {
    __extends(MyDelegate, _super);
    function MyDelegate() {
        _super.apply(this, arguments);
    }
    MyDelegate.prototype.setCallback = function (callback) {
        this.mCallback = callback;
    };
    MyDelegate.prototype.actionSheetPickerViewDidSelectDate = function (pickerView, date) {
        this.dateFormater = NSDateFormatter.alloc().init();
        this.dateFormater.dateFormat = "dd MM yyyy HH:mm Z";
        this.mCallback(this.dateFormater.stringFromDate(date));
    };
    MyDelegate.ObjCProtocols = [IQActionSheetPickerViewDelegate];
    return MyDelegate;
}(NSObject));
var _delegate = new MyDelegate();
var _title = "";
var _doneText = "Done";
var _cancelText = "Cancel";
function init(mCallback, title, initialDate, doneText, cancelText, buttonColor) {
    _delegate.setCallback(mCallback);
    if (title) {
        _title = title;
    }
    if (doneText) {
        _doneText = doneText;
    }
    if (cancelText) {
        _cancelText = cancelText;
    }
    mPickerManager = IQActionSheetPickerView.alloc().initWithTitleDoneTextCancelTextDelegate(_title, _doneText, _cancelText, _delegate);
    if (mPickerManager) {
        _isInit = true;
    }
    if (initialDate) {
        mPickerManager.date = _toNativeDate(initialDate);
    }
    if (buttonColor) {
        mPickerManager.buttonColor = buttonColor;
    }
    if (_isInit) {
        return true;
    }
    else {
        console.log("DATETIMEPICKER: the initialize of the plugin failed");
        return false;
    }
}
exports.init = init;
function _isInitFunction() {
    if (_isInit) {
        return true;
    }
    else {
        console.log("DATETIMEPICKER: you have to initialize the plugin first");
        return false;
    }
}
function registerCallback(mCallback) {
    if (_isInitFunction()) {
        console.log("DATETIMEPICKER: registerCallback is not supported for iOS");
    }
}
exports.registerCallback = registerCallback;
function showDatePickerDialog() {
    if (_isInitFunction()) {
        mPickerManager.actionSheetPickerStyle = 1;
        mPickerManager.show();
    }
}
exports.showDatePickerDialog = showDatePickerDialog;
function showTimePickerDialog() {
    if (_isInitFunction()) {
        mPickerManager.actionSheetPickerStyle = 3;
        mPickerManager.show();
    }
}
exports.showTimePickerDialog = showTimePickerDialog;
function showDateTimePickerDialog() {
    if (_isInitFunction()) {
        mPickerManager.actionSheetPickerStyle = 2;
        mPickerManager.show();
    }
}
exports.showDateTimePickerDialog = showDateTimePickerDialog;
function dismiss() {
    if (_isInitFunction()) {
        mPickerManager.dismiss();
    }
}
exports.dismiss = dismiss;
function _toNativeDate(date) {
    if (_isInitFunction()) {
        var comps = NSDateComponents.alloc().init();
        comps.day = date.getDate();
        comps.month = date.getMonth();
        comps.year = date.getFullYear();
        comps.hour = date.getHours();
        comps.minute = date.getMinutes();
        var cal = NSCalendar.alloc().initWithCalendarIdentifier(NSGregorianCalendar);
        var date = cal.dateFromComponents(comps);
        return date;
    }
}
function setMinDate(date) {
    if (_isInitFunction()) {
        mPickerManager.minimumDate(_toNativeDate(date));
    }
}
exports.setMinDate = setMinDate;
function setMaxDate(date) {
    if (_isInitFunction()) {
        mPickerManager.maximumDate(_toNativeDate(date));
    }
}
exports.setMaxDate = setMaxDate;
function setMinTime(minHour, minMinute) {
    if (_isInitFunction()) {
        console.log("DATETIMEPICKER: setMinTime is not supported for iOS");
    }
}
exports.setMinTime = setMinTime;
function setMaxTime(maxHour, maxMinute) {
    if (_isInitFunction()) {
        console.log("DATETIMEPICKER: setMaxTime is not supported for iOS");
    }
}
exports.setMaxTime = setMaxTime;
//# sourceMappingURL=timedatepicker-handler.ios.js.map