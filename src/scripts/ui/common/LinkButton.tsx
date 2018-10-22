import React from 'react';

interface ILinkButtonProps {
	readonly onClick?: () => void;
}

const LinkButton: React.SFC<ILinkButtonProps> = ({ onClick, children }) => (
	<button className="LinkButton" type="button" onClick={onClick}>
		{children}
	</button>
);

export default LinkButton;
