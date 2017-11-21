import React from 'react';

const ButtonRow = ({ children }) => (
	<ul className="ButtonRow">
		{children.map((item, i) => (
			<li className="ButtonRow-item" key={i}>
				{item}
			</li>
		))}
	</ul>
);

export default ButtonRow;
