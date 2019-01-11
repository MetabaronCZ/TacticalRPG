import React from 'react';
import { IcoID, Icos } from 'data/icos';

interface ILinkIcoProps {
	readonly ico: IcoID;
	readonly title: string;
	readonly onClick?: () => void;
}

const LinkIco: React.SFC<ILinkIcoProps> = ({ ico, title = '', onClick }) => (
	<button className="LinkIco" title={title} onClick={onClick}>
		{Icos[ico]}
	</button>
);

export default LinkIco;
