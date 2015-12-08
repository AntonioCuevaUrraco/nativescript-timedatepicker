package com.android.datetimepicker;

import android.app.Activity;

import com.android.datetimepicker.date.DatePickerDialog;
import com.android.datetimepicker.time.RadialPickerLayout;
import com.android.datetimepicker.time.TimePickerDialog;


import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;


public class PickerManager implements DatePickerDialog.OnDateSetListener, TimePickerDialog.OnTimeSetListener {

    private static final String TIME_PATTERN = "HH:mm";


    private Calendar calendar;
    private SimpleDateFormat timeFormat = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss");
    private Activity nativeScriptActivity;
    private DatePickerDialog mDateDialog;
    private TimePickerDialog mTimeDialog;
    private Callback mCallbackObject;
    private TimeZone mTimeZone;


    /**
     * Default constructor
     *
     * @param nativeScriptActivity The current nativeScript android Activity.
     * @return The class to manage the time and date pickers.
     */
    public PickerManager initialize(Activity nativeScriptActivity, final Callback<String> mCallback) {
        calendar = Calendar.getInstance();
        mTimeZone=calendar.getTimeZone();
        return initialize(nativeScriptActivity, calendar, mCallback);
    }

    /**
     * Extended constructor
     *
     * @param nativeScriptActivity The current nativeScript android Activity.
     * @param initialDate          The initial date and time that will be show on the dialogs.
     *  @param mCallback          The callback method what will be call with the result.
     * @return The class to manage the time and date pickers.
     */
    public PickerManager initialize(Activity nativeScriptActivity, Calendar initialDate,  final Callback<String> mCallback) {
        this.nativeScriptActivity = nativeScriptActivity;
        this.mCallbackObject=mCallback;
        this.calendar = initialDate;
        this.mTimeZone=initialDate.getTimeZone();
        this.mDateDialog = DatePickerDialog.newInstance(this, initialDate.get(Calendar.YEAR), initialDate.get(Calendar.MONTH), initialDate.get(Calendar.DAY_OF_MONTH));
        this.mTimeDialog = TimePickerDialog.newInstance(this, initialDate.get(Calendar.HOUR_OF_DAY), initialDate.get(Calendar.MINUTE), true);
        return this;
    }

    public void registerCallback(final Callback<String> mCallback){
        this.mCallbackObject= mCallback ;
    }


    public void showDatePickerDialog() {
        mDateDialog.show(nativeScriptActivity.getFragmentManager(), "datePicker");
    }

    public void showTimePickerDialog() {
        mTimeDialog.show(nativeScriptActivity.getFragmentManager(), "timePicker");
    }

    /**
     * Utility class to create a java calendar from JavaScript
     *
     * @param day    The day to be set.
     * @param month  The month to be set (0-11) for compatibility.
     * @param year   The year to be set .
     * @param hour   The hour of the day to be set.
     * @param minute The minute to be set.
     * @return the Java Calendar object.
     */
    public Calendar getCalendar(int day, int month, int year, int hour, int minute) {
        Calendar date = Calendar.getInstance();
        date.set(Calendar.YEAR, year);
        date.set(Calendar.MONTH, month);
        date.set(Calendar.DAY_OF_MONTH, day);
        date.set(Calendar.HOUR_OF_DAY, hour);
        date.set(Calendar.MINUTE, minute);
        return date;
    }

    /**
     * @return the selected date.
     */
    public String getDate() {
        int mGMTOffset = mTimeZone.getRawOffset();
        String mDate= timeFormat.format(calendar.getTime());
        mDate=mDate + " GMT" +(mGMTOffset >= 0 ? "+" : "-") + TimeUnit.HOURS.convert(mGMTOffset, TimeUnit.MILLISECONDS);
        return mDate;
    }

    /**
     * @return the selected time.
     */
    public String getTime() {
        int mGMTOffset = mTimeZone.getRawOffset();
        String mDate= timeFormat.format(calendar.getTime());
        mDate=mDate + " GMT" +(mGMTOffset >= 0 ? "+" : "-") + TimeUnit.HOURS.convert(mGMTOffset, TimeUnit.MILLISECONDS);
        return mDate;
    }

    /**
     * @return the native Android date picker dialog object.
     */
    public DatePickerDialog getDatePickerDialog() {
        return mDateDialog;
    }

    /**
     * @return the native Android time picker dialog object.
     */
    public TimePickerDialog getTimePickerDialog() {
        return mTimeDialog;
    }

    @Override
    public void onDateSet(DatePickerDialog dialog, int year, int monthOfYear, int dayOfMonth) {
        calendar.set(year, monthOfYear, dayOfMonth);
        mCallbackObject.onResult(this.getDate());
    }

    @Override
    public void onTimeSet(RadialPickerLayout view, int hourOfDay, int minute) {
        calendar.set(Calendar.HOUR_OF_DAY, hourOfDay);
        calendar.set(Calendar.MINUTE, minute);
        mCallbackObject.onResult(this.getTime());

    }

}
