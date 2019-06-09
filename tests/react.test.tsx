import * as React from 'react';
import { shallow } from 'enzyme';

import Separator from 'ui/common/Separator';

describe('React component test example', () => {
	test('#Separator', () => {
		const sep = shallow(<Separator />);
		expect(sep).toMatchSnapshot();
		expect(sep.hasClass('Separator')).toBeTruthy();
	});
});
