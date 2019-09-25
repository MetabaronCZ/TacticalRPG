import AIPresets from 'data/ai-presets';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Engine from 'modules/battle/engine';
import { ICharacterSnapshot } from 'modules/character';
import Player, { IPlayerCharacterSetup } from 'modules/battle/player';
import { IPlayerData } from 'modules/battle-configuration/player-data';

import CharacterRole from 'modules/ai/role';
import AICharacter from 'modules/ai/character';
import { IAIConfig, IAISettings } from 'modules/ai/settings';

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
			const role = new CharacterRole(char);
			return new AICharacter(char, engine, role);
		});
	}

	public onActStart(): void {
		const { act } = this.engine.serialize();

		if (!act) {
			throw new Error('Invalid act');
		}
		const actingChar = act.actingCharacter;

		if (!actingChar) {
			throw new Error('Could not get AI character: invalid acting character');
		}
		const aiChar = this.ally.find(ch => ch.character.data.id === actingChar.id);

		if (!aiChar) {
			throw new Error('Invalid actor');
		}
		const { character: { name }, role } = aiChar;
		Logger.info(`AI Player: ${name} [${role.get().join(', ')}]`);
	}

	public onUpdate(): void {
		const { act, characters } = this.engine.serialize();

		if (!act) {
			throw new Error('Invalid act');
		}
		const actingChar = act.actingCharacter;

		if (!actingChar) {
			throw new Error('Could not update AI character: invalid acting character');
		}
		const aiChar = this.ally.find(ch => ch.character.data.id === actingChar.id);

		if (!aiChar || aiChar.character.isDead()) {
			throw new Error('Invalid actor');
		}
		aiChar.update({
			act,
			ally: this.getAlly(characters),
			enemy: this.getEnemy(characters),
			obstacles: this.getObstacles(characters)
		});
	}

	private getAlly(characters: ICharacterSnapshot[]): ICharacterSnapshot[] {
		return characters.filter(char => char.player.id === this.id);
	}

	private getEnemy(characters: ICharacterSnapshot[]): ICharacterSnapshot[] {
		const enemy = characters.filter(char => char.player.id !== this.id);
		return enemy.filter(char => !char.dead && !char.dying);
	}

	private getObstacles(characters: ICharacterSnapshot[]): Tile[] {
		return characters.filter(char => !char.dead).map(char => char.position);
	}
}

export default AIPlayer;
