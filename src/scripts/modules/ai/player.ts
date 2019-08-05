import AIPresets from 'data/ai-presets';

import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Engine from 'modules/battle/engine';
import CharacterRole from 'modules/ai/role';
import Command from 'modules/battle/command';
import AICharacter from 'modules/ai/character';
import { IAIConfig, IAISettings } from 'modules/ai/settings';
import Player, { IPlayerCharacterSetup } from 'modules/battle/player';
import { IPlayerData } from 'modules/battle-configuration/player-data';

const conditionDanger = 0.65;
const conditionCritical = 0.35;

type CharacterCondition = 'OK' | 'DANGER' | 'CRITICAL';

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

	public getEnemy(): Character[] {
		const enemy = this.engine.getState().players.find(pl => pl !== this);

		if (!enemy) {
			throw new Error('AIPlayer could not find his enemy');
		}
		return enemy.getCharacters();
	}

	public getObstacles(): Tile[] {
		return this.engine.getState().characters
			.filter(char => !char.isDead())
			.map(char => char.position);
	}

	public onActStart() {
		const act = this.getAct();
		const char = this.getCharacter(act.actor);
		const condition = this.getCharacterCondition(char.character);

		switch (condition) {
			case 'CRITICAL':
				// TODO
				break;

			case 'DANGER':
				// TODO
				break;

			case 'OK':
				// TODO
				break;

			default:
				throw new Error('Invalid character condition: ' + condition);
		}
	}

	public onUpdate(commands: Command[]) {
		const act = this.getAct();
		const actingChar = act.getActingCharacter();

		if (!actingChar) {
			throw new Error('Could not update AI player: invalid acing character');
		}
		const char = this.getCharacter(actingChar);
		char.update(act, commands);
	}

	private getAct(): Act {
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

	private getCharacterCondition(character: Character): CharacterCondition {
		const { HP } = character.attributes;
		const { HP: baseHP } = character.baseAttributes;

		if (HP < baseHP * conditionCritical) {
			return 'CRITICAL';
		}
		if (HP < baseHP * conditionDanger) {
			return 'DANGER';
		}
		return 'OK';
	}
}

export default AIPlayer;
