// @flow
import Timezone, { fromNumber, toNumberOptions } from './Timezone';

/**
 * Pads numbers < 10 with a leading 0
 *
 * @private
 * @param  {Number} number - number to pad
 * @return {String}        - padded number
 */
const pad = (number: number): string => String(number).padStart(2, '0');


/**
 * @public
 * @module Timestamp
 */
const Timestamp = {
	fromDate: fromDate,
};

/**
 *
 * Outputs RFC3339 / ISO8601 String from Date
 *
 *
 * @public
 * @func timestamp
 * @memberof Timestamp
 * @param {Date}   [date=new Date()] - Date object
 * @param {Timezone} [timezone]      - Optional timezone to shift the time to (effective UTC time will remain the same).
 */
export function fromDate(date: Date = new Date(), timezone: ?Timezone) {
	const offset = timezone instanceof Timezone
		? timezone.toNumber(toNumberOptions.MILLISECONDS)
		: 0;

	date = new Date(
		// get time as ms UTC
		date.getTime()
		// adjust for local time offset
		+ (date.getTimezoneOffset() * 60 * 1000)
		// adjust for target TZ
		+ offset
	);

	const tz = timezone instanceof Timezone ? timezone.value : fromNumber(date.getTimezoneOffset(), true).value;
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());
	const milliseconds = (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5);

	return `${year}-${month}-${day}`
		+ `T${hours}:${minutes}:${seconds}.${milliseconds}`
		+ `${tz}`;
}

export const timestampFromDate = fromDate;

export default Timestamp.fromDate;
