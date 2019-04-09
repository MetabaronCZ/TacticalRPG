import React from 'react';

import { formatInteger } from 'core/number';

import Act from 'modules/battle/act';
import AIPlayer from 'modules/ai/player';
import Player from 'modules/battle/player';

import CharacterBadge from 'ui/battle/CharacterBadge';
import ArchetypeIco from 'ui/common/ArchetypeIco';

interface IProps {
	act: Act|null;
	players: Array<Player|AIPlayer>;
}

interface IState {
	visibleBadge: [number, number]|null;
}

class Players extends React.Component<IProps, IState> {
	public state: IState = {
		visibleBadge: null
	};

	public render() {
		const { players, act } = this.props;
		const { visibleBadge } = this.state;

		const badgeCharacter = visibleBadge
			? players[visibleBadge[0]].getCharacters().find((char, c) => c === visibleBadge[1])
			: null;

		return (
			<div className="Players">
				{players.map((pl, p) => (
					<div className="Players-item" key={p}>
						<h3 className="Heading">
							<span className={'Players-item-ico Players-item-ico--player-' + p} />
							{pl.getName()} ({pl instanceof AIPlayer ? 'AI' : 'HUMAN'} Player)
						</h3>

						<table className="Players-item-characters">
							<thead>
								<tr>
									<th>Name</th>
									<th className="Players-item-characters-heading">HP</th>
									<th className="Players-item-characters-heading">AP</th>
									<th className="Players-item-characters-heading">ARM</th>
									<th className="Players-item-characters-heading">ESH</th>
								</tr>
							</thead>

							<tbody>
								{pl.getCharacters().map((char, c) => {
									if (char.isDead()) {
										return;
									}
									const isDying = char.status.has('DYING');
									const isActive = !!(act && act.getActor() === char);
									const state = (isDying ? 'is-dying' : (isActive ? 'is-active' : ''));

									const { HP, AP, ARM, ESH } = char.attributes;
									const { HP: baseHP, AP: baseAP, ARM: baseARM, ESH: baseESH } = char.baseAttributes;

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

											<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
												{formatInteger(HP, 3)} <span className="Players-item-characters-item-base">/ {formatInteger(baseHP, 3)}</span>
											</td>

											<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
												{formatInteger(AP, 2)} <span className="Players-item-characters-item-base">/ {formatInteger(baseAP, 2)}</span>
											</td>

											<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
												{formatInteger(ARM, 3)} <span className="Players-item-characters-item-base">/ {formatInteger(baseARM, 3)}</span>
											</td>

											<td className="Players-item-characters-item-row Players-item-characters-item-row--number">
												{formatInteger(ESH, 3)} <span className="Players-item-characters-item-base">/ {formatInteger(baseESH, 3)}</span>
											</td>
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
