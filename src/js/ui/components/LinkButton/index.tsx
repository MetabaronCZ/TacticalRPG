import React from 'react';

interface ILinkButtonProps {
	onClick?: () => void;
	children: string|JSX.Element|JSX.Element[];
}

const LinkButton = ({ onClick, children }: ILinkButtonProps): JSX.Element => (
	<button className="LinkButton" onClick={onClick}>
		{children}
	</button>
);

export default LinkButton;
