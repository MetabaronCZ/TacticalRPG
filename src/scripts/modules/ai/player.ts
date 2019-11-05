import Logger from 'modules/logger';
import { IActSnapshot } from 'modules/battle/act';
import Engine, { IEngineSnapshot } from 'modules/battle/engine';
import Player, { IPlayerCharacterSetup } from 'modules/battle/player';
import { IPlayerData } from 'modules/battle-configuration/player-data';

import CharacterRole from 'modules/ai/role';
import AICharacter from 'modules/ai/character';

class AIPlayer extends Player {
	private readonly ally: AICharacter[];

	constructor(player: IPlayerData, characters: IPlayerCharacterSetup[], engine: Engine) {
		super(player, characters);

		this.ally = this.characters.map(char => {
			const role = new CharacterRole(char);
			return new AICharacter(char, engine, role);
		});
	}

	public onActStart(state: IEngineSnapshot): void {
		const { act } = state;

		if (!act) {
			throw new Error('Invalid engine state');
		}
		const char = this.getCharacter(act);

		const { character: { name }, role } = char;
		Logger.info(`AI Player: ${name} [${role.get().join(', ')}]`);
	}

	public onUpdate(state: IEngineSnapshot): void {
		const { act, suddenDeath, characters } = state;

		if (!act) {
			throw new Error('Invalid engine state');
		}
		const aiChar = this.getCharacter(act);

		if (aiChar.character.isDead()) {
			throw new Error('Invalid actor');
		}
		aiChar.update({
			act,
			characters,
			dangerousTiles: suddenDeath.highlightedTiles,
			ally: this.ally.map(char => char.serialize()),
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
