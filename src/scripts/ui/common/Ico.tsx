import React from 'react';

type GeneralIco = 'info';

interface IProps {
	name: GeneralIco;
	title?: string;
}

const Ico: React.SFC<IProps> = ({ name, title }) => (
	<span className={`Ico Ico--${name}`} title={title} />
);

export default Ico;
