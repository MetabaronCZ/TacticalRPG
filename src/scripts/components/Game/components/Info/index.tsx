import React from 'react';

interface IInfoProps {
	x: string;
}

const Info: React.SFC<IInfoProps> = ({ x }) => (
	<div>{x}</div>
);

export default Info;
