import React from 'react';

const ButtonRow: React.SFC<{}> = ({ children }) => (
	<ul className="ButtonRow">
		{(children instanceof Array)
			? children.map((item, i) => (
				<li className="ButtonRow-item" key={i}>
					{item}
				</li>
			))
			: <li className="ButtonRow-item">{children}</li>
		}
	</ul>
);

export default ButtonRow;
