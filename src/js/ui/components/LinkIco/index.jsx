import React from 'react';
import icos from 'utils/icos';

const LinkIco = ({ ico, title, onClick }) => (
	<button className="LinkIco" title={title} onClick={onClick}>
		{icos[ico]}
	</button>
);

export default LinkIco;
