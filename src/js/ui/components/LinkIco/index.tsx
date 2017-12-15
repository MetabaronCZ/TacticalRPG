import React from 'react';
import icos from 'utils/icos';

interface ILinkIcoProps {
	ico: string;
	title: string;
	onClick: any;
}

const LinkIco = ({ ico = '', title = '', onClick }: ILinkIcoProps): JSX.Element => (
	<button className="LinkIco" title={title} onClick={onClick}>
		{ico ? icos[ico] : ''}
	</button>
);

export default LinkIco;
