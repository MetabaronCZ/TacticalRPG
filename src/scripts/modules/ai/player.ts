import Act from 'modules/battle/act';
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
}

class AIPlayer extends Player {
	// private readonly config: IAIConfig;
	private enemy?: Player;
	private ally: AICharacter[] = [];
	private selectTile: (tile: Tile) => void;
	private selectAction: (action: CharacterAction) => void;

	constructor(id: number, name: string, config: IAIConfig, selectTile: IOnTileSelect, selectAction: IOnActionSelect) {
		super(id, name);
		// this.config = config;
		this.selectTile = selectTile;
		this.selectAction = selectAction;
	}

	public setEnemy(enemy: Player) {
		this.enemy = enemy;
	}

	public setCharacters(characters: Character[]) {
		super.setCharacters(characters);

		this.ally = this.characters.map(char => {
			return new AICharacter(char, this.selectTile, this.selectAction);
		});
	}

	public act(act: Act, actions: CharacterAction[]) {
		const { actor, phases } = act;
		const { MOVE, ACTION, DIRECTION } = phases;

		switch (act.getPhase()) {
			case 'MOVE':
				if ('IDLE' === MOVE.getPhase()) {
					const movable = MOVE.getMovable();
					this.onAction({ actor, actions, movable });
				}
				return;

			case 'ACTION':
				switch (ACTION.getPhase()) {
					case 'TARGETING':
						const targetable = ACTION.getTargetable();
						const target = ACTION.getTarget();

						if (target) {
							this.onActionConfirm(actions);
						} else {
							this.onActionTarget(actor, targetable);
						}
						return;

					case 'REACTING':
						const reaction = ACTION.getReaction();

						if (null === reaction) {
							throw new Error('AI Could not react: invalid reaction');
						}
						const { reactor, backAttacked } = reaction;

						switch (reaction.getPhase()) {
							case 'IDLE':
								this.onReaction(reactor, actions, backAttacked);
								return;

							case 'EVASION':
								const evasible = reaction.getEvasible();
								this.onEvasion(reactor, evasible);
								return;

							default:
								return; // do nothing
						}

					default:
						return; // do nothing
				}

			case 'DIRECTION':
				const directable = DIRECTION.getDirectable();
				this.onDirect(actor, directable);
				return;

			default:
				return; // do nothing
		}
	}

	public onAction(conf: IAIActStartData) {
		const { actor, actions, movable } = conf;

		if (actor.isDead() || !actions.length) {
			return;
		}
		const char = this.getCharacter(actor);
		const obstacles = this.getObstacles();
		const ally = this.ally.map(a => a.getCharacter());
		const enemy = (this.enemy ? this.enemy.getCharacters() : []);

		char.onAction({ actions, movable, ally, enemy, obstacles });
	}

	public onActionTarget(actor: Character, targetable: Tile[]) {
		if (actor.isDead()) {
			return;
		}
		const char = this.getCharacter(actor);
		char.onActionTarget(targetable);
	}

	public onActionConfirm(actions: CharacterAction[]) {
		const confirmAction = actions.find(act => 'CONFIRM' === act.type);

		if (!confirmAction) {
			throw new Error('AI character actions does not contain confirm action');
		}
		this.selectAction(confirmAction);
	}

	public onReaction(reactor: Character, actions: CharacterAction[], isBackAttacked: boolean) {
		if (reactor.isDead()) {
			return;
		}
		const char = this.getCharacter(reactor);
		const obstacles = this.getObstacles();
		char.onReaction(actions, isBackAttacked, obstacles);
	}

	public onEvasion(actor: Character, evasible: Tile[]) {
		if (actor.isDead()) {
			return;
		}
		const char = this.getCharacter(actor);
		char.onEvasion(evasible);
	}

	public onDirect(actor: Character, directable: Tile[]) {
		if (actor.isDead()) {
			return;
		}
		const char = this.getCharacter(actor);
		char.onDirect(directable);
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
