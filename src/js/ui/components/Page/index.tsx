import React from 'react';

interface IPageProps {
	heading: string;
	children: string|JSX.Element|JSX.Element[];
}

const Page = ({ heading, children }: IPageProps): JSX.Element => (
	<div className="Page">
		<h1 className="Heading Heading--large">
			{heading}
		</h1>
		{children}
	</div>
);

export default Page;
