import AIPresets from 'data/ai-presets';

import Tile from 'modules/geometry/tile';
import Engine from 'modules/battle/engine';
import Command from 'modules/battle/command';
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
		/* */
	}

	public onUpdate(commands: Command[]): void {
		const { act, characters } = this.engine.serialize();

		if (!act) {
			throw new Error('Invalid act');
		}
		const actingChar = act.actingCharacter;

		if (!actingChar) {
			throw new Error('Could not update AI player: invalid acing character');
		}
		const aiChar = this.ally.find(ch => ch.character.data.id === actingChar.id);
		const char = characters.find(ch => ch.id === actingChar.id);

		if (!aiChar || !char || char.dead) {
			throw new Error('Invalid actor');
		}
		aiChar.update({
			act,
			commands,
			ally: this.getAlly(characters),
			enemy: this.getEnemy(characters),
			obstacles: this.getObstacles(characters)
		});
	}

	private getAlly(characters: ICharacterSnapshot[]): ICharacterSnapshot[] {
		return characters.filter(char => char.player === this.id);
	}

	private getEnemy(characters: ICharacterSnapshot[]): ICharacterSnapshot[] {
		const enemy = characters.filter(char => char.player !== this.id);
		return enemy.filter(char => !char.dead && !char.dying);
	}

	private getObstacles(characters: ICharacterSnapshot[]): Tile[] {
		return characters.filter(char => !char.dead).map(char => char.position);
	}
}

export default AIPlayer;
