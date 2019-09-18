import React from 'react';
import Sexes from 'data/sexes';

type GeneralIco = 'info' | 'MALE' | 'FEMALE';

type IcoLabels= {
	[id in GeneralIco]: string;
}

const labels: IcoLabels = {
	info: 'Info',
	MALE: Sexes.get('MALE').title,
	FEMALE: Sexes.get('FEMALE').title
};

interface IProps {
	name: GeneralIco;
	minimal?: boolean;
}

const Ico: React.SFC<IProps> = ({ name, minimal }) => (
	<span
		className={`Ico Ico--${name} Ico--${minimal ? 'minimal' : 'default'}`}
		title={labels[name]}
	/>
);

export default Ico;
