import React from 'react';
import { ButtonIco, buttonIcos } from 'ui/common/Button';

interface ILinkIcoProps {
	readonly ico: ButtonIco;
	readonly title: string;
	readonly onClick?: () => void;
}

const LinkIco: React.SFC<ILinkIcoProps> = ({ ico, title = '', onClick }) => (
	<button className="LinkIco" title={title} onClick={onClick}>
		{buttonIcos[ico]}
	</button>
);

export default LinkIco;
