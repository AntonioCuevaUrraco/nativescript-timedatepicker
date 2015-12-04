var applicationModule = require("application");
var _isInit = false;
var _AndroidApplication = applicationModule.android;
var _act;
var mPickerManager;
function init(mCallback, title, initialDate) {
    //Title is not supported for android so we do nothing if there is one
    _act = _AndroidApplication.foregroundActivity || _AndroidApplication.startActivity;
    if (initialDate) {
        mPickerManager = new com.android.datetimepicker.PickerManager().initialize(_act, initialDate, new com.android.datetimepicker.Callback({
            onResult: function (result) {
                mCallback(result);
            }
        }));
    }
    mPickerManager = new com.android.datetimepicker.PickerManager().initialize(_act, new com.android.datetimepicker.Callback({
        onResult: function (result) {
            mCallback(result);
        }
    }));
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
function registerCallback(mCallback) {
    if (_isInitFunction()) {
        mPickerManager.registerCallback(new com.android.datetimepicker.Callback({
            onResult: function (result) {
                mCallback(result);
            }
        }));
    }
}
exports.registerCallback = registerCallback;
function _isInitFunction() {
    if (_isInit) {
        return true;
    }
    else {
        console.log("DATETIMEPICKER: you have to initialize the plugin first");
        return false;
    }
}
function showDatePickerDialog() {
    if (_isInitFunction()) {
        mPickerManager.showDatePickerDialog();
    }
}
exports.showDatePickerDialog = showDatePickerDialog;
function showTimePickerDialog() {
    if (_isInitFunction()) {
        mPickerManager.showTimePickerDialog();
    }
}
exports.showTimePickerDialog = showTimePickerDialog;
function showDateTimePickerDialog() {
    console.log("DATETIMEPICKER: date and time is not supported for android");
}
exports.showDateTimePickerDialog = showDateTimePickerDialog;
function _toNativeDate(date) {
    return mPickerManager.getCalendar(date.getDate(), date.getMonth(), date.getFullYear(), date.getHours(), date.getMinutes());
}
exports._toNativeDate = _toNativeDate;
function _getDatePickerDialog() {
    if (_isInitFunction()) {
        return mPickerManager.getDatePickerDialog();
    }
}
function _getTimePickerDialog() {
    if (_isInitFunction()) {
        return mPickerManager.getTimePickerDialog();
    }
}
function setMinDate(date) {
    if (_isInitFunction()) {
        _getDatePickerDialog().setMinDate(_toNativeDate(date));
    }
}
exports.setMinDate = setMinDate;
function setMaxDate(date) {
    if (_isInitFunction()) {
        _getDatePickerDialog().setMaxDate(_toNativeDate(date));
    }
}
exports.setMaxDate = setMaxDate;
function setMinTime(minHour, minMinute) {
    if (_isInitFunction()) {
        _getTimePickerDialog().setMaxTime(minHour, minMinute);
    }
}
exports.setMinTime = setMinTime;
function setMaxTime(maxHour, maxMinute) {
    if (_isInitFunction()) {
        _getTimePickerDialog().setMaxTime(maxHour, maxMinute);
    }
}
exports.setMaxTime = setMaxTime;
