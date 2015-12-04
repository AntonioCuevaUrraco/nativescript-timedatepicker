var observable = require("data/observable");
var applicationModule = require("application");
var PickerManager= require("nativescript-timedatepicker");



var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    function HelloWorldModel() {
        _super.call(this);
    }
    HelloWorldModel.prototype.timeTap = function () {
        
     var mCallback = function (result) {
        if (result) {
            alert("the time is "+result);
        }
    };
    PickerManager.init(mCallback,null,null);

    PickerManager.showTimePickerDialog();

    };

 HelloWorldModel.prototype.dateTap = function () {
           
 var mCallback = function (result) {
        if (result) {
             alert("the date is "+result);
        }
    };
    PickerManager.init(mCallback,null,null);

    PickerManager.showDatePickerDialog();
        
    };
    HelloWorldModel.prototype.bothTap = function () {
           
 var mCallback = function (result) {
        if (result) {
             alert("the date is "+result);
        }
    };
    PickerManager.init(mCallback,null,null);
    var minDate = new Date(2020, 11,  5, 00, 00);
    var maxDate = new Date(2020, 11, 10, 23, 60);
    
    PickerManager.setMinDate(minDate);
    PickerManager.setMaxDate(maxDate);

    PickerManager.showDateTimePickerDialog();
        
    };

    return HelloWorldModel;
})(observable.Observable);
exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();
