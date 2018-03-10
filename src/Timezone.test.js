/* eslint-env jest */
/* eslint-disable import/no-duplicates */
import Timezone, {
	getPrefixFor,
	getPrefixForSign,
	getSignForPrefix,
	fromNumber,
	toNumberOptions,
} from './Timezone';
import * as TimezoneFunctions from './Timezone';

describe('Timezone exports', () => {
	const io = {
		statics: [
			'fromNumber',
			'getPrefixFor',
			'getPrefixForSign',
			'getSignForPrefix',
		],
		methods: [
			'toString',
			'toNumber',
		],
	};
	it('new Timezone() should return a new instance of Timezone', () => expect(new Timezone() instanceof Timezone).toBe(true));
	io.statics.forEach(s => it(`Timezone.${s} should be a function`, () => {
		expect(typeof TimezoneFunctions[s]).toBe('function');
		expect(typeof Timezone[s]).toBe('function');
	}));
	io.methods.forEach(m => it(`new Timezone().${m} should be a function`, () => expect(typeof new Timezone()[m]).toBe('function')));
});

describe('Timezone getters', () => {
	const io = {
		value: [
			[ undefined, 'Z' ],
			[ '+3', '+0300' ],
			[ '+12', '+1200' ],
			[ '+300', '+0300' ],
			[ '+0003', '+0003' ],
			[ 'GMT+0800', '+0800' ],
			[ 'GMT+0200 (CEST)', '+0200' ],
			[ 'UTC +0800', '+0800' ],
			[ '+0800 (PST)', '+0800' ],
			[ '-3', '-0300' ],
			[ '–12', '-1200' ],
			[ '—300', '-0300' ],
			[ '-0003', '-0003' ],
			[ 'fubar', 'Z' ],
			[ '+0000', 'Z' ],
			[ '-0000', 'Z' ],
			[ 'Z', 'Z' ],
			[ 'UTC', 'Z' ],
			[ 'gmt', 'Z' ],
		],
		minutes: [
			[ undefined, 0 ],
			[ 'Z', 0 ],
			[ '+3', 0 ],
			[ '+12', 0 ],
			[ '+300', 0 ],
			[ '+0003', 3 ],
			[ '+1337', 37 ],
			[ '-3', 0 ],
			[ '-0003', 3 ],
			[ '-2442', 42 ],
		],
		hours: [
			[ undefined, 0 ],
			[ 'Z', 0 ],
			[ '+3', 3 ],
			[ '+12', 12 ],
			[ '+300', 3 ],
			[ '+0003', 0 ],
			[ '+1337', 13 ],
			[ '-3', 3 ],
			[ '-12', 12 ],
			[ '-0003', 0 ],
			[ '-2442', 24 ],
		],
		sign: [
			[ undefined, 0 ],
			[ 'Z', 0 ],
			[ '+0300', 1 ],
			[ '-0300', -1 ],
		],
		prefix: [
			[ undefined, 'Z' ],
			[ 'Z', 'Z' ],
			[ '+0300', '+' ],
			[ '-0300', '-' ],
		],
	};
	Object.getOwnPropertyNames(io).forEach((property) => {
		io[property].forEach(test => it(
			`new Timezone(${test[0]}).${property} should return '${test[1]}'`,
			() => expect(new Timezone(test[0])[property]).toBe(test[1]),
		));
	});
});

describe('Timezone.getPrefixFor', () => {
	const io = [
		[ 'Z', 'Z' ],
		[ '+1', '+' ],
		[ '-1', '-' ],
		[ '–1', '-' ],
		[ '—1', '-' ],
		[ ' ', 'Z' ],
		[ '+0000', 'Z' ],
		[ '-0000', 'Z' ],
		[ '-0100', '-' ],
	];
	io.forEach(test => it(
		`('${test[0]}') should return prefix '${test[1]}'`,
		() => expect(getPrefixFor(test[0])).toBe(test[1]),
	));
});

describe('Timezone.getPrefixForSign', () => {
	const io = [
		[ 1, '+' ],
		[ -1, '-' ],
		[ 0, 'Z' ],
		[ 100, '+' ],
		[ -100, '-' ],
		[ 0.1, '+' ],
		[ -0.1, '-' ],
		[ Number.POSITIVE_INFINITY, '+' ],
		[ Number.NEGATIVE_INFINITY, '-' ],
		[ Number.MIN_VALUE, '+' ],
		[ -Number.MIN_VALUE, '-' ],
		[ Number.MAX_VALUE, '+' ],
		[ -Number.MAX_VALUE, '-' ],
		[ Number.NaN, 'Z' ],
		[ Number.EPSILON, '+' ],
		[ -Number.EPSILON, '-' ],
		[ Number.MAX_SAFE_INTEGER, '+' ],
		[ Number.MIN_SAFE_INTEGER, '-' ],
	];
	io.forEach(test => it(
		`(${test[0]}) should return prefix '${test[1]}'`,
		() => expect(getPrefixForSign(test[0])).toBe(test[1]),
	));
});

describe('Timezone.getSignForPrefix', () => {
	const io = [
		[ 'Z', 0 ],
		[ '+1', 1 ],
		[ '-1', -1 ],
		[ '–1', -1 ],
		[ '—1', -1 ],
		[ ' ', 0 ],
		[ '+0000', 0 ],
		[ '-0000', 0 ],
		[ '-0100', -1 ],
	];
	io.forEach(test => it(
		`(${test[0]}) should return prefix '${test[1]}'`,
		() => expect(getSignForPrefix(test[0])).toBe(test[1]),
	));
});

describe('Timezone.fromNumber', () => {
	const io = [
		[ 0, 'Z' ],
		[ -0, 'Z' ],
		[ -60, '+0100', true ],
		[ -60, '-0100' ],
		[ 60, '-0100', true ],
		[ 60, '+0100' ],
		[ -42, '+0042', true ],
		[ 35, '-0035', true ],
		[ -90, '+0130', true ],
		[ 90, '-0130', true ],
		[ 90, '+0130' ],
	];
	io.forEach(test => it(
		`(${test[0]}, ${test[2]}).value should return '${test[1]}'`,
		() => expect(fromNumber(test[0], test[2]).value).toBe(test[1]),
	));

	it(
		'(-60) should return a new instance of Timezone',
		() => expect(fromNumber(-60) instanceof Timezone).toBe(true),
	);
});

describe('Timezone.toNumber', () => {
	const io = [
		[ 'Z', 0 ],
		[ '+0000', 0 ],
		[ '+0100', 60 ],
		[ '-0100', -60 ],
		[ '+0042', 42 ],
		[ '-0035', -35 ],
		[ '+0130', 90 ],
		[ '-0130', -90 ],
		[ '-0130', 90, true ],
		[ '+0130', -90, true ],
		[ '-0130', -90 / 60 / 24, toNumberOptions.DAYS ],
		[ '-0130', 90 / 60, toNumberOptions.HOURS, true ],
		[ '-0130', -90 / 60, toNumberOptions.HOURS ],
		[ '-0130', 90, toNumberOptions.MINUTES, true ],
		[ '-0130', -90 * 60, toNumberOptions.SECONDS ],
		[ '-0130', -90 * 60 * 1000, toNumberOptions.MILLISECONDS ],
		[ '-0730', -7.5 * 60 * 60 * 1000, toNumberOptions.MILLISECONDS ],
		[ '+0730', 7.5 * 60 * 60 * 1000, toNumberOptions.MILLISECONDS ],
	];
	io.forEach(test => it(
		`(${test[0]}, ${test[2]}, ${test[3]}) should return '${test[1]}'`,
		() => expect(new Timezone(test[0]).toNumber(test[2], test[3])).toBe(test[1]),
	));
});
