import React from 'react';

const Page = ({ heading, children }) => (
	<div className="Page">
		<h1 className="Heading Heading--large">
			{heading}
		</h1>

		{children}
	</div>
);

export default Page;