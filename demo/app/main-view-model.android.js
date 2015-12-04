var observable = require("data/observable");
var applicationModule = require("application");
var _AndroidApplication = applicationModule.android;
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

    
    var mCallback2 = function (result) {
        if (result) {
             alert("the result is "+result);
        }
    };

    var mCallback = function (result) {
        if (result) {
           PickerManager.registerCallback(mCallback2);
           PickerManager.showTimePickerDialog();
        }
    };
    
    PickerManager.init(mCallback,null,null);

    var minDate = new Date(2014, 12, 1, 12, 00, 00, 00);
    PickerManager.setMinDate(minDate);

    var maxDate = new Date(2016, 12, 1, 12, 00, 00, 00);
    PickerManager.setMaxDate(maxDate);

    PickerManager.showDatePickerDialog();
        
    };

    return HelloWorldModel;
})(observable.Observable);
exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();
