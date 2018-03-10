/* eslint-env jest */
import { timestampFromDate, Timezone } from './timestamp.es5';

describe('bundle', () => {
	it('should export timestampFromDate', () => expect(typeof timestampFromDate).toBe('function'));
	it('should export Timezone', () => expect(typeof Timezone).toBe('function'));
});
