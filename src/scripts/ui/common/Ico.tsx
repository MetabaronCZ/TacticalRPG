import React from 'react';
import Sexes from 'data/sexes';

type GeneralIco = 'info' | 'healing' | 'MALE' | 'FEMALE';

type IcoLabels= {
	readonly [id in GeneralIco]: string;
}

const labels: IcoLabels = {
	info: 'Info',
	healing: 'Healing',
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
