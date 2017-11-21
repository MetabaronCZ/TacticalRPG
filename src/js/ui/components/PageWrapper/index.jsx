import React from 'react';

const PageWrapper = ({ children }) => (
	<div className="PageWrapper">
		<div className="PageWrapper-inner">
			{children}
		</div>
	</div>
);

export default PageWrapper;
