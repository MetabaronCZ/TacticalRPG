import React from 'react';

const LinkButton = ({ onClick, children }) => (
	<button className="LinkButton" onClick={onClick}>
		{children}
	</button>
);

export default LinkButton;
