import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Player from 'modules/battle/player';
import AICharacter from 'modules/ai/character';
import { IAIConfig } from 'modules/ai/settings';
import CharacterAction from 'modules/battle/character-action';

export type IOnTileSelect = (tile: Tile) => void;
export type IOnActionSelect = (action: CharacterAction) => void;

interface IAIActStartData {
	actor: Character;
	actions: CharacterAction[];
	movable: Tile[];
	onTileSelect: IOnTileSelect;
	onActionSelect: IOnActionSelect;
}

class AIPlayer extends Player {
	// private readonly config: IAIConfig;
	private enemy?: Player|AIPlayer;
	private ally: AICharacter[] = [];

	constructor(name: string, config: IAIConfig) {
		super(name);
		// this.config = config;
	}

	public setEnemy(enemy: Player|AIPlayer) {
		this.enemy = enemy;
	}

	public setCharacters(characters: Character[]) {
		super.setCharacters(characters);

		this.ally = this.characters.map(char => {
			return new AICharacter(char);
		});
	}

	public onAction(conf: IAIActStartData) {
		const { actor, actions, movable, onTileSelect, onActionSelect } = conf;
		const char = this.getCharacter(actor);
		const obstacles = this.getObstacles();
		const enemy = (this.enemy ? this.enemy.getCharacters() : []);

		char.onAction({ actions, movable, enemy, obstacles, onTileSelect, onActionSelect });
	}

	public onActionTarget(actor: Character, targetable: Tile[], onSelect: IOnTileSelect) {
		const char = this.getCharacter(actor);
		char.onActionTarget(targetable, onSelect);
	}

	public onActionConfirm(actions: CharacterAction[], onSelect: IOnActionSelect) {
		const confirmAction = actions.find(act => 'CONFIRM' === act.id);

		if (!confirmAction) {
			throw new Error('AI character actions does not contain confirm action');
		}
		onSelect(confirmAction);
	}

	public onReaction(reactor: Character, actions: CharacterAction[], isBackAttacked: boolean, onSelect: IOnActionSelect) {
		const char = this.getCharacter(reactor);
		const obstacles = this.getObstacles();
		char.onReaction(actions, isBackAttacked, obstacles, onSelect);
	}

	public onEvasion(actor: Character, evasible: Tile[], onSelect: IOnTileSelect) {
		const char = this.getCharacter(actor);
		char.onEvasion(evasible, onSelect);
	}

	public onDirect(actor: Character, directable: Tile[], onSelect: IOnTileSelect) {
		const char = this.getCharacter(actor);
		char.onDirect(directable, onSelect);
	}

	private getCharacter(actor: Character): AICharacter {
		const char = this.ally.find(ch => ch.getCharacter() === actor);

		if (!char) {
			throw new Error('Actor is not an AI');
		}
		return char;
	}

	private getObstacles(): Tile[] {
		const enemy = this.enemy ? this.enemy.getCharacters() : [];
		return [
			...this.ally.map(ch => ch.getCharacter().position),
			...enemy.map(ch => ch.position)
		];
	}
}

export default AIPlayer;
