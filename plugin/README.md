# nativescript-timedatepicker

A NativeScript plugin providing native date and time pickers for Android and iOS.

##Android side
![alt tag](https://github.com/AntonioCuevaUrraco/nativescript-timedatepicker/blob/master/demo/Screenshots/Android.jpg) 
##iOS side
![alt tag](https://github.com/AntonioCuevaUrraco/nativescript-timedatepicker/blob/master/demo/Screenshots/ios.jpg) 

## Usage
```ts

//Import the plugin
import * as TimeDatePicker from 'nativescript-timedatepicker';

//Create a callback function
let mCallback =  ((result) => {
  if (result) {
    alert("the time is "+result);
  }
});

//Initialize the PickerManager (.init(yourCallback, title, initialDate))
TimeDatePicker.init(mCallback,null,null);

//Show the dialog
TimeDatePicker.showDatePickerDialog();

```
For more examples of usage see the demo [main-view-model.ts](https://github.com/AntonioCuevaUrraco/nativescript-timedatepicker/tree/master/demo/app).


##Credits
This plugin abstract two native libraries, hence here are the project and deserved merit to the creators.

For iOS https://github.com/hackiftekhar/IQActionSheetPickerView   
For Android https://github.com/CiTuX/datetimepicker
