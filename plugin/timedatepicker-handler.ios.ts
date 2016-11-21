//NativeScript modules
import applicationModule = require("application");
declare var NSOject, NSDate, NSDateFormatter, NSDateComponents, NSGregorianCalendar, NSCalendar: any;

var _isInit: boolean = false;
var _iOSApplication = applicationModule.ios;

var mPickerManager;

class MyDelegate extends NSObject implements IQActionSheetPickerViewDelegate{
    public static ObjCProtocols = [IQActionSheetPickerViewDelegate];

    public mCallback;
    public dateFormater;

    setCallback(callback: any){
      this.mCallback=callback;
    }
    actionSheetPickerViewDidSelectDate(pickerView: IQActionSheetPickerView, date: NSDate): void {

      this.dateFormater = NSDateFormatter.alloc().init();
      this.dateFormater.dateFormat = "dd MM yyyy HH:mm Z";
      this.mCallback(this.dateFormater.stringFromDate(date));
    }
}
var _delegate = new MyDelegate();
var _title = "";
var _doneText = "Done";
var _cancelText = "Cancel";
export function init(mCallback: any, title?: any, initialDate?: any, doneText?: any, cancelText?: any, buttonColor?: any): boolean {

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
  mPickerManager = IQActionSheetPickerView.alloc().initWithTitleDelegate(_title, _delegate);

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

function _isInitFunction(): boolean {
  if (_isInit) {
    return true;
  }
  else {
    console.log("DATETIMEPICKER: you have to initialize the plugin first");
    return false
  }
}

export function registerCallback(mCallback: any) {
  if (_isInitFunction()) {
    console.log("DATETIMEPICKER: registerCallback is not supported for iOS");
  }
}

/**
 * The 4 types of pickers on the native library
    * IQActionSheetPickerStyleTextPicker,      0
    * IQActionSheetPickerStyleDatePicker,      1
    * IQActionSheetPickerStyleDateTimePicker,  2
    * IQActionSheetPickerStyleTimePicker,      3
 */
export function showDatePickerDialog() {
  if (_isInitFunction()) {
    mPickerManager.actionSheetPickerStyle = 1;
    mPickerManager.show();
  }
}
export function showTimePickerDialog() {
  if (_isInitFunction()) {
    mPickerManager.actionSheetPickerStyle = 3;
    mPickerManager.show();
  }
}
export function showDateTimePickerDialog() {
  if (_isInitFunction()) {
    mPickerManager.actionSheetPickerStyle = 2;
    mPickerManager.show();
  }
}

export function dismiss() {
  if (_isInitFunction()) {
    mPickerManager.dismiss();
  }
}

 function _toNativeDate(date:Date): NSDate {
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

/**
    * Sets the minimal date supported by this DatePicker. Dates before (but not including) the
    * specified date will be disallowed from being selected.
    * @param Date object set to the year, month, day desired as the mindate.
*/
export function setMinDate(date: Date) {
  if (_isInitFunction()) {
    mPickerManager.minimumDate(_toNativeDate(date));
  }
}

/**
    * Sets the maximal date supported by this DatePicker. Dates after the
    * specified date will be disallowed from being selected.
    * @param Date object set to the year, month, day desired as the maxdate.
*/
export function setMaxDate(date: Date) {
  if (_isInitFunction()) {
    mPickerManager.maximumDate(_toNativeDate(date));
  }
}

/**
    * Optional method for setting the MinTime on the TimePicker
*/
export function setMinTime(minHour, minMinute) {
  if (_isInitFunction()) {
    console.log("DATETIMEPICKER: setMinTime is not supported for iOS");

  }
}

/**
    * Optional method for setting the MaxTime on the TimePicker   
*/
export function setMaxTime(maxHour, maxMinute) {
  if (_isInitFunction()) {
    console.log("DATETIMEPICKER: setMaxTime is not supported for iOS");

  }
}

