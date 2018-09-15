import React from 'react';
import { Link } from 'react-router-dom';

interface ICustomLinkProps {
	readonly href: string;
}

const CustomLink: React.SFC<ICustomLinkProps> = ({ href, children }) => (
	<Link className="Link" to={href}>
		{children}
	</Link>
);

export default CustomLink;
