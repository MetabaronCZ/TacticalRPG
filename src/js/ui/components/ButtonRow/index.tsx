import React, { ReactNode } from 'react';

interface IButtonRowProps {
	children: JSX.Element|JSX.Element[];
}

const ButtonRow = ({ children }: IButtonRowProps): JSX.Element => {
	if (!(children instanceof Array)) {
		return <li className="ButtonRow-item">{children}</li>;
	}
	return (
		<ul className="ButtonRow">
			{children.map((item: JSX.Element, i: number) => (
				<li className="ButtonRow-item" key={i}>
					{item}
				</li>
			))}
		</ul>
	);
};

export default ButtonRow;
