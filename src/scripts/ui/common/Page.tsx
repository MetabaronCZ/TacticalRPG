import React from 'react';
import PageWrapper from 'ui/common/PageWrapper';

interface IPageProps {
	readonly heading: string;
}

const Page: React.SFC<IPageProps> = ({ heading, children }) => (
	<PageWrapper>
		<div className="Page">
			<h1 className="Heading Heading--large">
				{heading}
			</h1>
			{children}
		</div>
	</PageWrapper>
);

export default Page;
