import React from 'react';
import { Link } from 'react-router-dom';

const CustomLink = ({ href, children }) => (
	<Link className="Link" to={href}>
		{children}
	</Link>
);

export default CustomLink;
