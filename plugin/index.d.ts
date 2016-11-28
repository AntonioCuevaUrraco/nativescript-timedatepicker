/**
 * Initialize the Picker instance.
 * @param {Date} callback - a date object set to the year, month, day desired as the mindate.
 * @param {string} title - a date object set to the year, month, day desired as the mindate.
 * @param {string} initialDate - a date object set to the year, month, day desired as the mindate.
 * @param {string} doneText - Deprecated. *** iOS Only ***
 * @param {string} cancelText - Deprecated. *** iOS Only ***
 * @param {string} buttonColor -UIColor for the cancel and done buttons *** iOS Only ***
 */
export function init(callback: Function, title?: string, initialDate?: Date, doneText?: any, cancelText?: any, buttonColor?: any): boolean;

/**
 * Show the Time picker dialog.
 */
export function showTimePickerDialog(): void;

/**
 * Show the Date picker dialog.
 */
export function showDatePickerDialog(): void;

/**
 * Show the Date and Time Picker Dialogs - *** iOS Only ***
 */
export function showDateTimePickerDialog(): void;

/**
 * Set the minimal date supported by this DatePicker. Dates before (but not including) the
 * specified date will be disallowed from being selected.
 * @param {Date} minDate - a date object set to the year, month, day desired as the mindate.
 */
export function setMinDate(minDate: Date): void;

/**
 * Set the maximal date supported by this DatePicker. Dates after the
 * specified date will be disallowed from being selected.
 * @param {Date} maxDate - a date object set to the year, month, day desired as the maxdate.
 */
export function setMaxDate(maxDate: Date): void;

/**
 * Set the min time supported for the TimePicker instance - *** Android Only ***
 * @param {number} minHour - The min hour allowed.
 * @param {number} minMinute - The min minute allowed.
 */
export function setMinTime(minHour, minMinute): void;

/**
 * Set the max time supported for the TimePicker instance - *** Android Only ***
 * @param {number} maxHour - The max hour allowed.
 * @param {number} maxMinute - The max minute allowed.
 */
export function setMaxTime(maxHour, maxMinute): void;

/**
 * Dismiss the Picker - *** iOS Only ***
 */
export function dismiss(): void;
