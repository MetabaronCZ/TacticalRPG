import React from 'react';

import { ISummaryPlayerData } from 'modules/battle-summary/player';

import { formatCharacter } from 'ui/format';
import PlayerIco from 'ui/common/PlayerIco';

interface IProps {
	readonly players: ISummaryPlayerData[];
}

const SummaryPlayers: React.SFC<IProps> = ({ players }) => (
	<ul className="Layout">
		<li className="Layout-row">
			{players.map(data => (
				<div className="Layout-column u-col-1-2" key={data.id}>
					<div className="Paragraph">
						<div>
							<PlayerIco id={data.id} />
							<strong>Player "{data.player.name}"</strong>
						</div>

						<table className="Table">
							<tbody>
								{data.characters.filter(char => !!char).map(char => (
									<tr className="Table-row" key={char.id}>
										<td className="Table-column">
											{char.name}
										</td>

										<td className="Table-column">
											{'\u00A0'}{formatCharacter(char)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			))}
		</li>
	</ul>
);

export default SummaryPlayers;
