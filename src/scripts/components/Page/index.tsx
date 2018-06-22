import React from 'react';

interface IPageProps {
	readonly heading: string;
}

const Page: React.SFC<IPageProps> = ({ heading, children }) => (
	<div className="Page">
		<h1 className="Heading Heading--large">
			{heading}
		</h1>
		{children}
	</div>
);

export default Page;
