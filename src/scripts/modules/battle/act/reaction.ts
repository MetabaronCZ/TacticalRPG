import { formatTile } from 'modules/format';
import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import CharacterAction from 'modules/battle/character-action';

interface IActReactionEvents {
	onStart: (reaction: ActReaction) => void;
	onSelected: (reaction: ActReaction) => void;
	onEvasionStart: (reaction: ActReaction) => void;
	onEvasionEnd: (reaction: ActReaction) => void;
	onBlock: (reaction: ActReaction) => void;
	onShield: (reaction: ActReaction) => void;
	onReset: (reaction: ActReaction) => void;
	onPass: (reaction: ActReaction) => void;
	onEnd: (reaction: ActReaction) => void;
}

export interface IActReactionRecord {
	readonly id: number;
	readonly reactor: string;
	readonly action: string | null;
	readonly evasionTarget: string | null;
}

export type ActReactionState = 'INIT' | 'IDLE' | 'SELECTED' | 'EVASION' | 'BLOCK' | 'DONE';

class ActReaction {
	private readonly id: number;
	private readonly reactor: Character;
	private readonly isBackAttack: boolean;
	private readonly obstacles: Tile[] = [];
	private readonly events: IActReactionEvents;

	private state: ActReactionState = 'INIT';
	private action: CharacterAction | null = null;
	private evasionTarget: Tile | null = null; // selected evasion tile
	private evasionTargets: Tile[] = []; // possible evasion tiles of reacting character

	constructor(id: number, reactor: Character, isBackAttack: boolean, obstacles: Tile[], events: IActReactionEvents) {
		this.id = id;
		this.reactor = reactor;
		this.obstacles = obstacles;
		this.isBackAttack = isBackAttack;
		this.events = this.prepareEvents(events);
	}

	public getState(): ActReactionState {
		return this.state;
	}

	public getId(): number {
		return this.id;
	}

	public isBackAttacked(): boolean {
		return this.isBackAttack;
	}

	public canEvade(): boolean {
		return this.reactor.position.getSideTiles(this.obstacles).length > 0;
	}

	public getReactor(): Character {
		return this.reactor;
	}

	public getAction(): CharacterAction | null {
		return this.action;
	}

	public getEvasionTarget(): Tile | null {
		return this.evasionTarget;
	}

	public getEvasionTargets(): Tile[] {
		return this.evasionTargets;
	}

	public start() {
		const { state} = this;

		if ('INIT' !== state) {
			throw new Error('Could not start reaction: invalid state ' + state);
		}
		this.state = 'IDLE';
		this.events.onStart(this);
	}

	public selectAction(action: CharacterAction) {
		const { state } = this;

		if ('IDLE' !== state) {
			throw new Error('Could not select reaction: invalid state ' + state);
		}
		const skills = action.skills;

		if (!skills.length) {
			throw new Error('Could not select reaction: invalid action');
		}

		if (this.isBackAttack) {
			throw new Error('Cannot react if back attacked');
		}

		if (!action.isActive()) {
			throw new Error('Cannot react');
		}
		this.state = 'SELECTED';
		this.action = action;

		this.events.onSelected(this);

		const skillId = skills[0].id;

		switch (skillId) {
			case 'EVADE':
				this.evasionStart();
				break;

			case 'ENERGY_SHIELD':
				this.shield();
				break;

			case 'SHD_SMALL_BLOCK':
				this.block('BLOCK_SMALL');
				break;

			case 'SHD_LARGE_BLOCK':
				this.block('BLOCK_LARGE');
				break;

			default:
				throw new Error('Invalid reaction skill');
		}
	}

	public selectEvasionTarget(target: Tile) {
		const { state, action, reactor, evasionTargets } = this;

		if ('EVASION' !== state) {
			throw new Error('Could not select evasion target: invalid state ' + state);
		}

		if (null === action || !action.skills.length || !action.isActive()) {
			throw new Error('Could not select evasion target: invalid action');
		}

		if (!target.isContained(evasionTargets)) {
			// non-evasible tile selected
			return;
		}
		this.state = 'DONE';
		this.evasionTarget = target;

		const skills = action.skills;
		const cost = skills[0].apCost;

		// update reacting character
		const { AP } = reactor.attributes;
		reactor.position = target;
		reactor.attributes.set('AP', AP - cost);

		this.events.onEvasionEnd(this);

		// run second event after update (prevent race condition)
		setTimeout(() => {
			this.events.onEnd(this);
		});
	}

	public pass(passAction: CharacterAction) {
		const { state} = this;

		if ('IDLE' !== state) {
			throw new Error('Could not pass reaction: invalid state ' + state);
		}
		this.state = 'DONE';
		this.action = passAction;

		this.events.onPass(this);

		// run second event after update (prevent race condition)
		setTimeout(() => {
			this.events.onEnd(this);
		});
	}

	public reset() {
		this.state = 'IDLE';
		this.action = null;
		this.evasionTarget = null;
		this.evasionTargets = [];

		this.events.onReset(this);
	}

	public serialize(): IActReactionRecord {
		return {
			id: this.id,
			reactor: this.reactor.data.id,
			action: (this.action ? this.action.title : null),
			evasionTarget: (this.evasionTarget ? this.evasionTarget.id : null)
		};
	}

	private evasionStart() {
		const { state, reactor, obstacles } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not start evasion reaction: invalid state ' + state);
		}
		this.state = 'EVASION';

		// update reacting character
		const evasionArea = reactor.position.getSideTiles(obstacles);
		this.evasionTargets = evasionArea;

		this.events.onEvasionStart(this);
	}

	private block(block: 'BLOCK_SMALL' | 'BLOCK_LARGE') {
		const { state } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not start block reaction: invalid state ' + state);
		}
		this.state = 'DONE';
		this.reactor.status.apply(this.reactor, block);

		this.events.onBlock(this);

		// run second event after update (prevent race condition)
		setTimeout(() => {
			this.events.onEnd(this);
		});
	}

	private shield() {
		const { state } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not start energy shield reaction: invalid state ' + state);
		}
		this.state = 'DONE';
		this.reactor.status.apply(this.reactor, 'ENERGY_SHIELD');

		this.events.onShield(this);

		// run second event after update (prevent race condition)
		setTimeout(() => {
			this.events.onEnd(this);
		});
	}

	private prepareEvents(events: IActReactionEvents): IActReactionEvents {
		return {
			onStart: reaction => {
				Logger.info(`ActReaction onStart: "${reaction.getReactor().name}"`);
				events.onStart(reaction);
			},
			onSelected: reaction => {
				const action = reaction.getAction();
				Logger.info(`ActReaction onReactionSelected: "${action ? action.title : '-'}"`);
				events.onSelected(reaction);
			},
			onEvasionStart: reaction => {
				Logger.info('ActReaction onEvasionStart');
				events.onEvasionStart(reaction);
			},
			onEvasionEnd: reaction => {
				const tgt = reaction.getEvasionTarget();
				Logger.info(`ActReaction onEvasionEnd: ${formatTile(tgt)}`);
				events.onEvasionEnd(reaction);
			},
			onBlock: reaction => {
				Logger.info('ActReaction onBlock');
				events.onBlock(reaction);
			},
			onShield: reaction => {
				Logger.info('ActReaction onShield');
				events.onShield(reaction);
			},
			onReset: reaction => {
				Logger.info('ActReaction onReset');
				events.onReset(reaction);
			},
			onPass: reaction => {
				Logger.info('ActReaction onPass');
				events.onPass(reaction);
			},
			onEnd: reaction => {
				Logger.info('ActReaction onEnd');
				events.onEnd(reaction);
			}
		};
	}
}

export default ActReaction;
