import React from 'react';

import { formatInteger } from 'core/number';

import Act from 'modules/battle/act';
import AIPlayer from 'modules/ai/player';
import Player from 'modules/battle/player';

import ArchetypeIco from 'ui/common/ArchetypeIco';

import PlayerIco from 'ui/battle/PlayerIco';
import CharacterBadge from 'ui/battle/CharacterBadge';

interface IProps {
	act: Act;
	players: Player[];
}

interface IState {
	visibleBadge: [number, number] | null;
}

class Players extends React.Component<IProps, IState> {
	public state: IState = {
		visibleBadge: null
	};

	public render() {
		const { players, act } = this.props;
		const { visibleBadge } = this.state;
		const actingCharacter = act.getActingCharacter();

		const badgeCharacter = visibleBadge
			? players[visibleBadge[0]].getCharacters().find((char, c) => c === visibleBadge[1])
			: null;

		return (
			<div className="Players">
				{players.map((pl, p) => (
					<div className="Players-item" key={p}>
						<h3 className="Heading">
							<PlayerIco player={pl} />
							{pl.name}{pl instanceof AIPlayer ? ' (AI)' : ''}
						</h3>

						<table className="Players-item-characters">
							<thead>
								<tr>
									<th>Character</th>
									<th className="Players-item-characters-heading">HP</th>
									<th className="Players-item-characters-heading">MP</th>
									<th className="Players-item-characters-heading">AP</th>
								</tr>
							</thead>

							<tbody>
								{pl.getCharacters().map((char, c) => {
									const isActor = (act.actor === char);
									let state = '';

									if (isActor) {
										state = 'is-actor';
									}
									if (actingCharacter === char) {
										state = 'is-active';
									}
									if (char.status.has('DYING')) {
										state = 'is-dying';
									}
									const { HP, AP, MP } = char.attributes;
									const { HP: baseHP, AP: baseAP, MP: baseMP } = char.baseAttributes;

									return (
										<tr
											className={`Players-item-characters-item ${state}`}
											onMouseEnter={this.showBadge(p, c)}
											onMouseLeave={this.hideBadge()}
											key={c}
										>
											<td className="Players-item-characters-item-row">
												<ArchetypeIco archetype={char.archetype.id} />
												&nbsp;&nbsp;
												<strong>{char.name}</strong>
											</td>

											{
												char.isDead()
													? (
														<td className="Players-item-characters-item-row" colSpan={4}>
															Dead
														</td>
													)
													: (
														<React.Fragment>
															<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
																{formatInteger(HP, 3)} <span className="Players-item-characters-item-base">/ {formatInteger(baseHP, 3)}</span>
															</td>

															<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
																{baseMP > 0
																	? (
																		<span>
																			{formatInteger(MP, 3)} <span className="Players-item-characters-item-base">/ {formatInteger(baseMP, 3)}</span>
																		</span>
																	)
																	: <span className="u-disabled">N/A</span>
																}
															</td>

															<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
																{formatInteger(AP, 2)} <span className="Players-item-characters-item-base">/ {formatInteger(baseAP, 2)}</span>
															</td>
														</React.Fragment>
													)
											}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				))}

				{badgeCharacter && (
					<CharacterBadge character={badgeCharacter} />
				)}
			</div>
		);
	}

	private showBadge = (player: number, character: number) => () => {
		this.setState({
			visibleBadge: [player, character]
		});
	}

	private hideBadge = () => () => {
		this.setState({
			visibleBadge: null
		});
	}
}

export default Players;
