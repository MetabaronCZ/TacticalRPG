import AIPresets from 'data/ai-presets';

import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Engine from 'modules/battle/engine';
import Command from 'modules/battle/command';
import { IAIConfig, IAISettings } from 'modules/ai/settings';
import AICharacter, { CharacterRole } from 'modules/ai/character';
import Player, { IPlayerCharacterSetup } from 'modules/battle/player';
import { IPlayerData } from 'modules/battle-configuration/player-data';

const getCharacterRoles = (char: Character): CharacterRole[] => {
	const { archetype, mainHand: main, offHand: off } = char;
	const roles: CharacterRole[] = [];

	const hasHealing = ('HOLY' === char.skillset.element);
	const hasRangedWpn = ('RANGED' === main.type || 'RANGED' === off.type);
	const hasMeleeWpn = (
		('NONE' !== main.type && 'RANGED' !== main.type) ||
		('NONE' !== off.type && 'RANGED' !== off.type)
	);

	if (archetype.type.M) {
		if (hasHealing) {
			roles.push('HEALER');
		} else {
			roles.push('MAGE');
		}
	}
	if (archetype.type.S) {
		if (hasRangedWpn) {
			roles.push('RANGER');
		}
	}
	if (archetype.type.P || archetype.type.S) {
		if (hasMeleeWpn) {
			roles.push('MELEE');
		}
	}
	return roles;
};

class AIPlayer extends Player {
	public readonly config: IAIConfig;
	private readonly ally: AICharacter[];
	private readonly engine: Engine;

	constructor(player: IPlayerData, characters: IPlayerCharacterSetup[], ai: IAISettings, engine: Engine) {
		super(player, characters);

		this.config = ai.config;
		this.engine = engine;

		const { preset } = ai;

		if ('CUSTOM' !== preset) {
			this.config = AIPresets.get(preset).config;
		}

		this.ally = this.characters.map(char => {
			const roles = getCharacterRoles(char);
			return new AICharacter(char, engine, roles);
		});
	}

	public getEnemy(): Character[] {
		const enemy = this.engine.getState().players.find(pl => pl !== this);

		if (!enemy) {
			throw new Error('AIPlayer could not find his enemy');
		}
		return enemy.getCharacters();
	}

	public getObstacles(): Tile[] {
		const enemy = this.getEnemy();
		return [
			...this.ally.map(ch => ch.character.position),
			...enemy.map(ch => ch.position)
		];
	}

	public update(act: Act, commands: Command[]) {
		const actingChar = act.getActingCharacter();

		if (actingChar) {
			const char = this.getCharacter(actingChar);
			this.updateGoals();
			char.update(act, commands);
		}
	}

	private updateGoals() {
		// TODO
	}

	private getCharacter(actor: Character): AICharacter {
		const char = this.ally.find(ch => ch.character === actor);

		if (!char || char.character.isDead()) {
			throw new Error('Invalid actor');
		}
		return char;
	}
}

export default AIPlayer;
