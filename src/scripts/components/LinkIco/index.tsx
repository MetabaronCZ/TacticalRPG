import React from 'react';
import icos from 'data/icos';

interface ILinkIcoProps {
	ico: string;
	title: string;
	onClick: any;
}

const LinkIco: React.SFC<ILinkIcoProps> = ({ ico = '', title = '', onClick }) => (
	<button className="LinkIco" title={title} onClick={onClick}>
		{ico ? icos[ico] : ''}
	</button>
);

export default LinkIco;