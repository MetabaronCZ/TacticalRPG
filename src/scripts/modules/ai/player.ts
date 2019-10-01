import AIPresets from 'data/ai-presets';

import Logger from 'modules/logger';
import Engine from 'modules/battle/engine';
import Player, { IPlayerCharacterSetup } from 'modules/battle/player';
import { IPlayerData } from 'modules/battle-configuration/player-data';

import CharacterRole from 'modules/ai/role';
import AICharacter from 'modules/ai/character';
import { IAIConfig, IAISettings } from 'modules/ai/settings';
import { IActSnapshot } from 'modules/battle/act';

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
		const char = this.getCharacter(act);

		const { character: { name }, role } = char;
		Logger.info(`AI Player: ${name} [${role.get().join(', ')}]`);
	}

	public onUpdate(): void {
		const { act, characters } = this.engine.serialize();

		if (!act) {
			throw new Error('Invalid act');
		}
		const aiChar = this.getCharacter(act);

		if (aiChar.character.isDead()) {
			throw new Error('Invalid actor');
		}
		aiChar.update({
			act,
			characters,
			enemy: characters.filter(char => char.player.id !== this.id)
		});
	}

	private getCharacter(act: IActSnapshot): AICharacter {
		if (!act) {
			throw new Error('Invalid act');
		}
		const actingChar = act.actingCharacter;

		if (!actingChar) {
			throw new Error('Invalid acting character');
		}
		const aiChar = this.ally.find(ch => ch.character.id === actingChar.id);

		if (!aiChar) {
			throw new Error('Invalid actor');
		}
		return aiChar;
	}
}

export default AIPlayer;
