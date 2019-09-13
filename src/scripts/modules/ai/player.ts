import AIPresets from 'data/ai-presets';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Engine from 'modules/battle/engine';
import Command from 'modules/battle/command';
import { IActState } from 'modules/battle/act';
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

	public getEnemy(aliveOnly = false): Character[] {
		const enemy = this.engine.getState().players.find(pl => pl !== this);

		if (!enemy) {
			throw new Error('AIPlayer could not find his enemy');
		}
		let characters = enemy.getCharacters();

		if (aliveOnly) {
			characters = characters.filter(char => {
				return !char.isDead() && !char.status.has('DYING');
			});
		}
		return characters;
	}

	public getObstacles(): Tile[] {
		return this.engine.getState().characters
			.filter(char => !char.isDead())
			.map(char => char.position);
	}

	public onActStart(): void {
		/* */
	}

	public onUpdate(commands: Command[]): void {
		const act = this.getAct();
		const actingChar = act.actingCharacter;

		if (!actingChar) {
			throw new Error('Could not update AI player: invalid acing character');
		}
		const char = this.getCharacter(actingChar);
		char.update(act, commands);
	}

	private getAct(): IActState {
		const { act } = this.engine.getState();

		if (!act) {
			throw new Error('Invalid act');
		}
		return act;
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
