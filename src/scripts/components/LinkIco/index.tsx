import React from 'react';
import Icos from 'data/icos';

interface ILinkIcoProps {
	readonly ico: string;
	readonly title: string;
	readonly onClick?: () => void;
}

const LinkIco: React.SFC<ILinkIcoProps> = ({ ico = '', title = '', onClick }) => (
	<button className="LinkIco" title={title} onClick={onClick}>
		{ico ? Icos[ico] : ''}
	</button>
);

export default LinkIco;
