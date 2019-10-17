import React from 'react';

import { getTiles } from 'modules/geometry/tiles';
import { getIdleCommands, getReactiveCommands } from 'modules/battle/commands';

import Character from 'modules/character';
import Player from 'modules/battle/player';
import { PlayerData } from 'modules/battle-configuration/player-data';
import { ICharacterData, isBothWielding, isDualWielding } from 'modules/character-creation/character-data';

import Ico from 'ui/common/Ico';
import ArmorIco from 'ui/common/ArmorIco';
import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import ArchetypeIco from 'ui/common/ArchetypeIco';

const dummyTile = getTiles()[0];
const dummyPlayerConfig = new PlayerData(-1, {});
const dummyPlayer = new Player(dummyPlayerConfig, []);

const getDummyCharacter = (character: ICharacterData): Character => {
	return new Character(character, dummyTile, 'S', dummyPlayer);
};

interface IProps {
	readonly character: ICharacterData;
}

const CharacterPreview: React.SFC<IProps> = ({ character }) => {
	const char = getDummyCharacter(character);
	const { name, sex, archetype, attributes, skillset, mainHand, offHand, armor } = char;
	const hasShield = ('SHIELD_SMALL' === offHand.id || 'SHIELD_LARGE' === offHand.id);
	const { STR, VIT, MAG, SPR, SPD, MOV, HP, MP, AP } = attributes;

	const activeCommands = getIdleCommands(char).filter(cmd => {
		return cmd.skills.find(skill => 'ACTIVE' === skill.type);
	});

	const reactiveCommands = getReactiveCommands(char, false, true, false).filter(cmd => {
		return cmd.skills.find(skill => 'REACTIVE' === skill.type);
	});

	return (
		<div className="CharacterPreview">
			<p className="Paragraph">
				<strong>{name || '?????'}</strong>
				{' '}
				<Ico name={sex.id} minimal />
				{' '}
				<ArchetypeIco archetype={archetype.id} />
				{' '}
				{archetype.title}
				{' '}
				{!!skillset.element && (
					<ElementIco element={skillset.element} />
				)}
			</p>

			<h3 className="Heading Heading--small">
				Attributes
			</h3>

			<table className="Table Table--plain">
				<tbody>
					<tr>
						<td className="Table-column">STR:</td>
						<td className="Table-column u-align-right">{STR}</td>

						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>

						<td className="Table-column">MAG:</td>
						<td className="Table-column u-align-right">{MAG}</td>

						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>

						<td className="Table-column">SPD:</td>
						<td className="Table-column u-align-right">{SPD}</td>
					</tr>
					<tr>
						<td className="Table-column">VIT:</td>
						<td className="Table-column u-align-right">{VIT}</td>

						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>

						<td className="Table-column">SPR:</td>
						<td className="Table-column u-align-right">{SPR}</td>

						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>

						<td className="Table-column">MOV:</td>
						<td className="Table-column u-align-right">{MOV}</td>
					</tr>
					<tr>
						<td className="Table-column">HP:</td>
						<td className="Table-column u-align-right">{HP}</td>

						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>

						<td className="Table-column">MP:</td>
						<td className="Table-column u-align-right">{MP || '−'}</td>

						<td className="Table-column">
							<span className="u-disabled">|</span>
						</td>

						<td className="Table-column">AP:</td>
						<td className="Table-column u-align-right">{AP}</td>
					</tr>
				</tbody>
			</table>

			<h3 className="Heading Heading--small">
				Equipment
			</h3>

			<table className="Table Table--plain">
				<tbody>
					<tr>
						<td className="Table-column">MH:</td>
						<td className="Table-column">
							<WeaponIco weapon={mainHand.id} minimal />
							{' '}
							<strong>{mainHand.title}</strong>
							{' '}
							{'NONE' !== mainHand.id && (
								<span>
									(PHY: {mainHand.physical}, MAG: {mainHand.magical})
								</span>
							)}
						</td>
					</tr>
					<tr>
						<td className="Table-column">OH:</td>
						<td className="Table-column">
							{isBothWielding(character) || isDualWielding(character)
								? (
									<span className="u-disabled">
										<WeaponIco weapon={mainHand.id} minimal />
										{' '}
										{mainHand.title}
									</span>
								)
								: (
									<span>
										<WeaponIco weapon={offHand.id} minimal />
										{' '}
										<strong>{offHand.title}</strong>
										{' '}
										{'NONE' !== offHand.id && (
											hasShield
												? (
													<span>
														(BLOCK: {offHand.block || 0})
													</span>
												)
												: (
													<span>
														(PHY: {offHand.physical}, MAG: {offHand.magical})
													</span>
												)
										)}
									</span>
								)
							}
						</td>
					</tr>
					<tr>
						<td className="Table-column">AR:</td>
						<td className="Table-column">
							<ArmorIco armor={armor.id} minimal />
							{' '}
							<strong>{armor.title}</strong>
							{' '}
							{'NONE' !== armor.id && (
								<span>
									(PHY: {armor.physical * 100}%, MAG: {armor.magical * 100}%)
								</span>
							)}
						</td>
					</tr>
				</tbody>
			</table>

			{activeCommands.length + reactiveCommands.length > 0 && (
				<div>
					<h3 className="Heading Heading--small">
						Commands
					</h3>

					{activeCommands.length > 0 && (
						<p className="Paragraph">
							<strong>Active:</strong> {activeCommands.map(cmd => cmd.title).join(', ')}
						</p>
					)}

					{reactiveCommands.length > 0 && (
						<p className="Paragraph">
							<strong>Reactive:</strong> {reactiveCommands.map(cmd => cmd.title).join(', ')}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default CharacterPreview;
