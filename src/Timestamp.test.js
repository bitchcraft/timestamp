/* eslint-env jest */
import Timestamp, { timestampFromDate, fromDate } from './Timestamp';
import Timezone from './Timezone';

describe('Timestamp', () => {
	it('should export { fromDate }', () => expect(typeof fromDate).toBe('function'));
	it('should default { timestampFromDate }', () => expect(typeof timestampFromDate).toBe('function'));
	it('should default export fromDate', () => expect(typeof Timestamp).toBe('function'));

	const io = [{
		in: [
			new Date('December 17, 1995 03:24:00 +0000'),
			new Timezone('Z'),
		],
		out: '1995-12-17T03:24:00.000Z',
	}, {
		in: [
			new Date('December 17, 1995 03:24:00 +0000'),
			new Timezone('-0400'),
		],
		out: '1995-12-16T23:24:00.000-0400',
	}, {
		in: [
			new Date('December 17, 1995 03:24:00 +0000'),
			new Timezone('+0100'),
		],
		out: '1995-12-17T04:24:00.000+0100',
	}];

	io.forEach((test, i) => {
		it(`fromDate(...test[${i}]) should return '${test.out}'`, () => expect(fromDate(...test.in)).toBe(test.out));
	});
});
