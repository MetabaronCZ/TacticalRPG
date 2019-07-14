import React from 'react';

import { Icos, IcoID } from 'data/icos';

import { getTiles } from 'modules/geometry/tiles';
import { getIdleCommands, getReactiveCommands } from 'modules/battle/commands';

import Character from 'modules/character';
import Player from 'modules/battle/player';
import { PlayerData } from 'modules/battle-configuration/player-data';
import { CharacterData } from 'modules/character-creation/character-data';

import ArchetypeIco from 'ui/common/ArchetypeIco';

const dummyTile = getTiles()[0];
const dummyPlayerConfig = new PlayerData(0, {});
const dummyPlayer = new Player(dummyPlayerConfig, []);

const getDummyCharacter = (character: CharacterData): Character => {
	return new Character(character, dummyTile, 'BOTTOM', dummyPlayer);
};

interface IProps {
	readonly character: CharacterData;
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
				{Icos[sex.id.toLowerCase() as IcoID]}
				{' '}
				<ArchetypeIco archetype={archetype.id} />
				{' '}
				{archetype.title}
				{' '}
				{(archetype.type.M && 'NONE' !== skillset.id) && (
					<span>({skillset.title})</span>
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
							{character.isBothWielding() || character.isDualWielding()
								? <span className="u-disabled">{mainHand.title}</span>
								: (
									<span>
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