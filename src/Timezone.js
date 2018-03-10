// @flow
/* eslint-disable class-methods-use-this */

const SUBSTITUTIONS = [
	[/^gmt$/, 'Z'],
	[/^utc$/, 'Z'],
	['utc', ''],
	['gmt', ''],
];

export const toNumberOptions = [
	'MILLENIA',
	'CENTURIES',
	'DECADES',
	'YEARS',
	'QUARTERS',
	'MONTHS',
	'WEEKS',
	'DAYS',
	'HOURS',
	'MINUTES',
	'SECONDS',
	'MILLISECONDS',
].reduce((acc, v) => { acc[v] = v; return acc; }, {});

const toNumberConfig = {
	[toNumberOptions.MILLENIA]: 1 / (60 * 24 * 7 * 365.25 * 1000),
	[toNumberOptions.CENTURIES]: 1 / (60 * 24 * 7 * 365.25 * 100),
	[toNumberOptions.DECADES]: 1 / (60 * 24 * 7 * 365.25 * 10),
	[toNumberOptions.YEARS]: 1 / (60 * 24 * 7 * 365),
	[toNumberOptions.QUARTERS]: 1 / ((60 * 24 * 7 * 30 * 3) + 1.25),
	[toNumberOptions.MONTHS]: 1 / (60 * 24 * 7 * 30),
	[toNumberOptions.WEEKS]: 1 / (60 * 24 * 7),
	[toNumberOptions.DAYS]: 1 / (60 * 24),
	[toNumberOptions.HOURS]: 1 / 60,
	[toNumberOptions.MINUTES]: 1,
	[toNumberOptions.SECONDS]: 60,
	[toNumberOptions.MILLISECONDS]: 60 * 1000,
};

/**
 * Timezone helper class
 * Timezone instances are immutable
 *
 * @public
 * @class
 * @name Timezone
 */
class Timezone {
	_value: string

	/**
	 * A helper tool for storing timezones.
	 *
	 * ```js
	 * new Timezone()
	 * ```
	 *
	 * All properties are read-only.
	 *
	 * @public
	 * @param {string} [timezoneString='+0000'] - a valid timezone string
	 * @prop {string} value - string representation of the timezone
	 * @prop {number} hours - integer representation of the hours part of the
	 *     timezone. Getter will return unsigned integer value. See toNumber()
	 *     to get an integer representation of the timezone.
	 * @prop {number} minutes - integer representation of the minutes part of
	 *     the timezone. Getter will return unsigned integer value. See toNumber()
	 *     to get an integer representation of the timezone.
	 * @prop {number} sign - number representation of the prefix of the timenzone.
	 * @prop {string} prefix - string representation of the prefix part of the
	 *     timezone.
	 * @returns {Timezone} - new Timezone instance
	 */
	constructor(timezoneString: string = '+0000'): Timezone {
		if (!timezoneString || typeof timezoneString !== 'string') {
			throw (new Error('Timezone: timezoneString has to be a non-empty string'));
		}

		SUBSTITUTIONS.forEach((sub) => {
			timezoneString = timezoneString.toLowerCase().trim().replace(...sub);
		});

		timezoneString = timezoneString.trim().slice(0, 5);

		const prefix = Timezone.getPrefixFor(timezoneString);

		let tzAbsOffset = prefix === 'Z' ? '' : timezoneString.slice(1);
		switch (tzAbsOffset.length) {
			case 0:
				break;

			case 3:
				tzAbsOffset = tzAbsOffset.padStart(4, '0');
				break;

			default:
				tzAbsOffset = tzAbsOffset.padStart(2, '0').padEnd(4, '0');
		}

		this._value = `${prefix}${tzAbsOffset}`;
		return this;
	}

	get value(): string { return this.toString(); }

	get minutes(): number {
		return this.value === 'Z' ? 0 : parseInt(this.value.slice(3, 5));
	}

	get hours(): number {
		return this.value === 'Z' ? 0 : parseInt(this.value.slice(1, 3));
	}

	get sign(): number { return Timezone.getSignForPrefix(this._value); }

	get prefix(): string { return this._value.slice(0, 1); }

	/**
	 * returns string value of instance
	 * @private
	 * @method toString
	 * @return {string}
	 */
	toString() {
		return this._value;
	}

	/**
	 * Get a number representation of timezone
	 * @public
	 * @method toNumber
	 * @param  {string} [option=MINUTES] - Scale, one of:
	 *     * MILLISECONDS
	 *     * SECONDS
	 *     * MINUTES
	 *     * HOURS
	 *     * DAYS
	 *     * WEEKS
	 *     * MONTHS
	 *     * QUARTERS
	 *     * YEARS
	 *     * DECADES
	 *     * CENTURIES
	 *     * MILLENIA
	 * @param  {boolean} [invertSign=false] - set to true to match sign polarity of Date.getTimezoneOffset()
	 * @return {number} - Timezone offset as number. Note that offset has
	 *     opposite sign of Date.prototype.getTimezoneOffset
	 */
	toNumber(option: string = toNumberOptions.MINUTES, invertSign: boolean = false): number {
		const {
			value,
			hours,
			minutes,
			sign,
		} = this;

		// allow omission of option when setting invertSign
		if (typeof option === 'boolean') {
			invertSign = option;
			option = toNumberOptions.MINUTES;
		}

		// handle Z
		if (value === 'Z') return 0;

		// handle all other cases
		return toNumberConfig[option] * sign * ((hours * 60) + minutes) * (invertSign ? -1 : 1);
	}

	/**
	 * creates a new Timezone object from a number
	 * @public
	 * @static
	 * @method fromNumber
	 * @param  {number}  offset             - in minutes
	 * @param  {boolean} [invertSign=false] - set to true when passing Date.getTimezoneOffset()
	 * @return {Timezone}
	 */
	static fromNumber = fromNumber

	/**
	 * returns cleaned prefix
	 * @public
	 * @static
	 * @method getPrefixFor
	 * @param  {string} timezoneString - e. g. '+0400'
	 * @return {string}                - returns '+' for '+', '-' for '-'/'–'/'—' and 'Z' for everything else
	 */
	static getPrefixFor = getPrefixFor

	/**
	 * returns prefix
	 * @public
	 * @static
	 * @method getPrefixForSign
	 * @param  {number} sign - e. g. -1
	 * @return {string}                - returns '+' for positive numbers, '-' for negative numbers and 'Z' for everything else
	 */
	static getPrefixForSign = getPrefixForSign

	/**
	 * returns Math.sign()
	 * @public
	 * @static
	 * @method getPrefixSignFor
	 * @param  {string} timezoneString - e. g. '+0400'
	 * @return {number}                - returns 1 for '+', -1 for '-'/'–'/'—' and 0 for everything else
	 */
	static getSignForPrefix = getSignForPrefix
}

export function fromNumber(offset: number, invertSign: boolean = false) {
	const sign = invertSign ? -1 : 1;
	const offsetPrefix = Timezone.getPrefixForSign(offset * sign);
	offset = Math.abs(offset);
	const offsetHours = String(Math.floor(offset / 60)).padStart(2, '0');
	const offsetMinutes = String(Math.floor(offset % 60)).padStart(2, '0');
	const timezoneString = offsetPrefix === 'Z' ? offsetPrefix : `${offsetPrefix}${offsetHours}${offsetMinutes}`;
	return new Timezone(timezoneString);
}

export function getPrefixFor(timezoneString: string): string {
	if (!timezoneString || typeof timezoneString !== 'string') {
		throw (new Error('getPrefixFor: timezoneString has to be a non-empty string'));
	}

	switch (Timezone.getSignForPrefix(timezoneString)) {
		case 1: return '+';
		case -1: return '-';
		default: return 'Z';
	}
}

export function getPrefixForSign(sign: number): string {
	if (typeof sign !== 'number') {
		throw (new Error('getPrefixForSign: timezoneString has to be a number'));
	}

	switch (Math.sign(sign)) {
		case 1: return '+';
		case -1: return '-';
		default: return 'Z';
	}
}

export function getSignForPrefix(timezoneString: string): number {
	if (!timezoneString || typeof timezoneString !== 'string') {
		throw (new Error('getPrefixSignFor: timezoneString has to be a non-empty string'));
	}

	if (timezoneString.replace(/0/g, '').length === 1) return 0;

	switch (timezoneString.slice(0, 1)) {
		case '+': return 1;
		case '-': return -1;
		case '–': return -1;
		case '—': return -1;
		default: return 0;
	}
}

export default Timezone;
