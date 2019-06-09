import { formatNumber } from 'core/number';

describe('Unit test example', () => {
	test('#formatNumber', () => {
		const nr = formatNumber(2000);
		expect(nr).toBe('2,000');
	});
});
