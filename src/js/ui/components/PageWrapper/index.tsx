import React from 'react';

interface IPageWrapperProps {
	children: string|JSX.Element|JSX.Element[];
}

const PageWrapper = ({ children }: IPageWrapperProps): JSX.Element => (
	<div className="PageWrapper">
		<div className="PageWrapper-inner">
			{children}
		</div>
	</div>
);

export default PageWrapper;
