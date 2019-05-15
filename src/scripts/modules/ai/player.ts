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
	private enemy?: Player;
	private ally: AICharacter[] = [];

	constructor(id: number, name: string, config: IAIConfig) {
		super(id, name);
		// this.config = config;
	}

	public setEnemy(enemy: Player) {
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

		if (actor.isDead()) {
			return;
		}
		const char = this.getCharacter(actor);
		const obstacles = this.getObstacles();
		const ally = this.ally.map(a => a.getCharacter());
		const enemy = (this.enemy ? this.enemy.getCharacters() : []);

		char.onAction({ actions, movable, ally, enemy, obstacles, onTileSelect, onActionSelect });
	}

	public onActionTarget(actor: Character, targetable: Tile[], onSelect: IOnTileSelect) {
		if (actor.isDead()) {
			return;
		}
		const char = this.getCharacter(actor);
		char.onActionTarget(targetable, onSelect);
	}

	public onActionConfirm(actions: CharacterAction[], onSelect: IOnActionSelect) {
		const confirmAction = actions.find(act => 'CONFIRM' === act.type);

		if (!confirmAction) {
			throw new Error('AI character actions does not contain confirm action');
		}
		onSelect(confirmAction);
	}

	public onReaction(reactor: Character, actions: CharacterAction[], isBackAttacked: boolean, onSelect: IOnActionSelect) {
		if (reactor.isDead()) {
			return;
		}
		const char = this.getCharacter(reactor);
		const obstacles = this.getObstacles();
		char.onReaction(actions, isBackAttacked, obstacles, onSelect);
	}

	public onEvasion(actor: Character, evasible: Tile[], onSelect: IOnTileSelect) {
		if (actor.isDead()) {
			return;
		}
		const char = this.getCharacter(actor);
		char.onEvasion(evasible, onSelect);
	}

	public onDirect(actor: Character, directable: Tile[], onSelect: IOnTileSelect) {
		if (actor.isDead()) {
			return;
		}
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
