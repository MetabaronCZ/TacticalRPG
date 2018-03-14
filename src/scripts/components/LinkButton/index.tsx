import React from 'react';

interface ILinkButtonProps {
	onClick?: () => void;
}

const LinkButton: React.SFC<ILinkButtonProps> = ({ onClick, children }) => (
	<button className="LinkButton" onClick={onClick}>
		{children}
	</button>
);

export default LinkButton;
