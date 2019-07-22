import AIPresets from 'data/ai-presets';

import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Engine from 'modules/battle/engine';
import Command from 'modules/battle/command';
import AICharacter from 'modules/ai/character';
import { IAIConfig, IAISettings } from 'modules/ai/settings';
import Player, { IPlayerCharacterSetup } from 'modules/battle/player';
import { IPlayerData } from 'modules/battle-configuration/player-data';

export type IOnTileSelect = (tile: Tile) => void;
export type IOnCommandSelect = (command: Command) => void;

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
			return new AICharacter(char, engine);
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
