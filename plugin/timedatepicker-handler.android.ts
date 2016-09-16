//NativeScript modules
import applicationModule = require("application");

declare var android, java, com: any;

var _isInit: boolean = false;
var _AndroidApplication = applicationModule.android;
var _act: android.app.Activity;

var mPickerManager;

// export function init(mCallback: any, title?: any, initialDate?: any): boolean {
export function init(mCallback: any, title?: any, initialDate?: any, doneText = null, cancelText = null, buttonColor = null): boolean {

  //Title is not supported for android so we do nothing if there is one


  //if no foregroundActivity fall to startActivity
  _act = _AndroidApplication.foregroundActivity || _AndroidApplication.startActivity;

  //initialize with initial date
  if (initialDate) {
    mPickerManager = new com.android.datetimepicker.PickerManager().initialize(
      _act,
      _toNativeDate(initialDate),
      new com.android.datetimepicker.Callback({
        onResult: function (result) {
          mCallback(result);
        }
      }));
  }
  else {
    //initialize with actual system date
    mPickerManager = new com.android.datetimepicker.PickerManager().initialize(
      _act,
      new com.android.datetimepicker.Callback({
        onResult: function (result) {
          mCallback(result);
        }
      }));
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
export function registerCallback(mCallback: any) {
  if (_isInitFunction()) {
    mPickerManager.registerCallback(new com.android.datetimepicker.Callback({
      onResult: function (result) {
        mCallback(result);
      }
    }));
  }
}

function _isInitFunction(): boolean {
  if (_isInit) {
    return true;
  }
  else {
    console.log("DATETIMEPICKER: you have to initialize the plugin first");
    return false
  }
}

export function showDatePickerDialog() {
  if (_isInitFunction()) {
    mPickerManager.showDatePickerDialog();
  }
}

export function showTimePickerDialog() {
  if (_isInitFunction()) {
    mPickerManager.showTimePickerDialog();
  }
}
export function showDateTimePickerDialog() {
  console.log("DATETIMEPICKER: date and time is not supported for android")
}

export function _toNativeDate(date: Date): java.util.Calendar {
  var nativeDate = java.util.Calendar.getInstance();
  nativeDate.set(java.util.Calendar.YEAR, date.getFullYear());
  nativeDate.set(java.util.Calendar.MONTH, date.getMonth());
  nativeDate.set(java.util.Calendar.DAY_OF_MONTH, date.getDate());
  nativeDate.set(java.util.Calendar.HOUR_OF_DAY, date.getHours());
  nativeDate.set(java.util.Calendar.MINUTE, date.getMinutes());
  return nativeDate;
}

/**
   * @return the native Android date picker dialog object.
*/
function _getDatePickerDialog(): com.android.datetimepicker.date.DatePickerDialog {
  if (_isInitFunction()) {
    return mPickerManager.getDatePickerDialog();
  }
}
/**
   * @return the native Android time picker dialog object.
*/
function _getTimePickerDialog(): com.android.datetimepicker.time.TimePickerDialog {
  if (_isInitFunction()) {
    return mPickerManager.getTimePickerDialog();
  }
}

/**
    * Sets the minimal date supported by this DatePicker. Dates before (but not including) the
    * specified date will be disallowed from being selected.
    * @param calendar a Calendar object set to the year, month, day desired as the mindate.
*/
export function setMinDate(date: Date) {
  if (_isInitFunction()) {
    _getDatePickerDialog().setMinDate(_toNativeDate(date));
  }
}

/**
    * Sets the maximal date supported by this DatePicker. Dates after the
    * specified date will be disallowed from being selected.
    * @param calendar a Calendar object set to the year, month, day desired as the maxdate.
*/
export function setMaxDate(date: Date) {
  if (_isInitFunction()) {
    _getDatePickerDialog().setMaxDate(_toNativeDate(date));
  }
}

/**
    * Optional method for setting the MinTime on the TimePicker
*/
export function setMinTime(minHour, minMinute) {
  if (_isInitFunction()) {
    _getTimePickerDialog().setMaxTime(minHour, minMinute);
  }
}

/**
    * Optional method for setting the MaxTime on the TimePicker   
*/
export function setMaxTime(maxHour, maxMinute) {
  if (_isInitFunction()) {
    _getTimePickerDialog().setMaxTime(maxHour, maxMinute);
  }
}




