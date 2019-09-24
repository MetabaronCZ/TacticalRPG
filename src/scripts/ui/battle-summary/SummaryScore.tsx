import React from 'react';

import PlayerIco from 'ui/common/PlayerIco';
import { IScoreItem } from 'modules/battle-summary/score';

interface IProps {
	readonly items: IScoreItem[];
	readonly postfix?: string;
}

const SummaryScore: React.SFC<IProps> = ({ items, postfix = '' }) => {
	if (!items.length) {
		return <React.Fragment />;
	}
	return (
		<table className="Table Table--plain">
			<tbody>
				{items.map((item, i) => (
					<tr key={i}>
						<td className="Table-column">
							{i + 1}.
						</td>

						<td className="Table-column">
							<PlayerIco id={item.player} />
							{item.name}:
						</td>

						<td className="Table-column">
							{item.amount}{postfix}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default SummaryScore;
