var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        this.dateFormater.dateFormat = "EEE, d MMM yyyy HH:mm:ss z";
        this.mCallback(this.dateFormater.stringFromDate(date));
    };
    MyDelegate.ObjCProtocols = [IQActionSheetPickerViewDelegate];
    return MyDelegate;
})(NSObject);
var _delegate = new MyDelegate();
function init(mCallback, title, initialDate) {
    _delegate.setCallback(mCallback);
    if (title) {
        mPickerManager = IQActionSheetPickerView.alloc().initWithTitleDelegate(title, _delegate);
    }
    else {
        mPickerManager = IQActionSheetPickerView.alloc().initWithTitleDelegate("", _delegate);
    }
    if (initialDate) {
        mPickerManager.date = initialDate;
    }
    if (mPickerManager) {
        _isInit = true;
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
function _toNativeDate(date) {
    if (_isInitFunction()) {
        var comps = NSDateComponents.alloc().init();
        comps.day = date.getDate();
        comps.month = date.getMonth();
        comps.year = date.getFullYear();
        comps.hour = date.getHours();
        comps.minute = date.getMinutes();
        var cal = NSCalendar.alloc().initWithCalendarIdentifier(NSGregorianCalendar);
        var nativeDate = cal.dateFromComponents(comps);
        comps.release();
        return nativeDate;
    }
}
function setMinDate(date) {
    if (_isInitFunction()) {
        mPickerManager.minimumDate=_toNativeDate(date);
    }
}
exports.setMinDate = setMinDate;
function setMaxDate(date) {
    if (_isInitFunction()) {
        mPickerManager.maximumDate=_toNativeDate(date);
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
