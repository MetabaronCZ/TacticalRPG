import React from 'react';
import { Link } from 'react-router-dom';

interface ICustomLinkProps {
	href: string;
	children: string|JSX.Element|JSX.Element[];
}

const CustomLink = ({ href, children }: ICustomLinkProps): JSX.Element => (
	<Link className="Link" to={href}>
		{children}
	</Link>
);

export default CustomLink;
