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

interface IAIActStartData {
	readonly actor: Character;
	readonly movable: Tile[];
	readonly commands: Command[];
}

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

	public update(act: Act, commands: Command[]) {
		const { actor, phases } = act;
		const { MOVEMENT, COMMAND, REACTION, DIRECTION } = phases;

		switch (act.getPhase()) {
			case 'MOVEMENT':
				if ('IDLE' === MOVEMENT.getPhase()) {
					const movable = MOVEMENT.getMovable();
					this.onCommand({ actor, commands, movable });
				}
				return;

			case 'COMMAND':
				switch (COMMAND.getPhase()) {
					case 'TARGETING':
						const targetable = COMMAND.getTargetable();
						const target = COMMAND.getTarget();

						if (target) {
							this.onCommandConfirm(commands);
						} else {
							this.onCommandTarget(actor, targetable);
						}
						return;

					default:
						return; // do nothing
				}

			case 'REACTION':
				const reaction = REACTION.getReaction();

				if (!reaction) {
					throw new Error('AI Could not react: invalid reaction');
				}
				const { reactor, phase, combat, evasible } = reaction;

				switch (phase) {
					case 'IDLE':
						this.onReaction(reactor, commands, combat[0].backAttack);
						return;

					case 'EVASION':
						this.onEvasion(reactor, evasible);
						return;

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

	public onCommand(conf: IAIActStartData) {
		const { actor, commands, movable } = conf;

		if (actor.isDead() || !commands.length) {
			return;
		}
		const char = this.getCharacter(actor);
		const obstacles = this.getObstacles();
		const ally = this.ally.map(a => a.getCharacter());
		const enemy = this.getEnemy().getCharacters();

		char.onCommand({ commands, movable, ally, enemy, obstacles });
	}

	public onCommandTarget(actor: Character, targetable: Tile[]) {
		if (actor.isDead()) {
			return;
		}
		const char = this.getCharacter(actor);
		char.onCommandTarget(targetable);
	}

	public onCommandConfirm(commands: Command[]) {
		const confirmCommand = commands.find(act => 'CONFIRM' === act.type);

		if (!confirmCommand) {
			throw new Error('AI character commands does not contain confirm command');
		}
		this.engine.selectCommand(confirmCommand);
	}

	public onReaction(reactor: Character, commands: Command[], isBackAttacked: boolean) {
		if (reactor.isDead()) {
			return;
		}
		const char = this.getCharacter(reactor);
		const obstacles = this.getObstacles();
		char.onReaction(commands, isBackAttacked, obstacles);
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
		const enemy = this.getEnemy();
		return [
			...this.ally.map(ch => ch.getCharacter().position),
			...enemy.getCharacters().map(ch => ch.position)
		];
	}

	private getEnemy(): Player {
		const enemy = this.engine.getState().players.find(pl => pl !== this);

		if (!enemy) {
			throw new Error('AIPlayer could not find his enemy');
		}
		return enemy;
	}
}

export default AIPlayer;
