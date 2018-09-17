import Logger from 'engine/logger';
import Position from 'engine/position';
import Character from 'engine/character';
import CharacterAction from 'engine/character-action';

interface IActReactionEvents {
	onStart: (reaction: ActReaction) => void;
	onReactionSelected: (reaction: ActReaction) => void;
	onBlock: (reaction: ActReaction) => void;
	onEvasionStart: (reaction: ActReaction) => void;
	onEvasionEnd: (reaction: ActReaction) => void;
	onReset: (reaction: ActReaction) => void;
	onPass: (reaction: ActReaction) => void;
	onEnd: (reaction: ActReaction) => void;
}

export type ActReactionState = 'INIT' | 'IDLE' | 'SELECTED' | 'EVASION' | 'BLOCK' | 'DONE';

class ActReaction {
	private readonly id: number;
	private readonly reactor: Character;
	private readonly obstacles: Position[] = [];
	private readonly events: IActReactionEvents;

	private state: ActReactionState = 'INIT';
	private action: CharacterAction|null = null;
	private evasionTarget: Position|null = null; // selected evasion tile position
	private evasionTargets: Position[] = []; // possible evasion positions of reacting character

	constructor(id: number, reactor: Character, obstacles: Position[], events: IActReactionEvents) {
		this.id = id;
		this.reactor = reactor;
		this.obstacles = obstacles;
		this.events = this.prepareEvents(events);
	}

	public getState(): ActReactionState {
		return this.state;
	}

	public getId(): number {
		return this.id;
	}

	public getReactor(): Character {
		return this.reactor;
	}

	public getAction(): CharacterAction|null {
		return this.action;
	}

	public getEvasionTarget(): Position|null {
		return this.evasionTarget;
	}

	public getEvasionTargets(): Position[] {
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
		const skills = action.getSkills();

		if (!skills.length) {
			throw new Error('Could not select reaction: invalid action');
		}
		this.state = 'SELECTED';
		this.action = action;

		this.events.onReactionSelected(this);

		const skillId = skills[0].getId();

		switch (skillId) {
			case 'EVADE':
				this.evasionStart();
				break;

			case 'SHIELD_SMALL_BLOCK':
				this.block('BLOCK_SMALL');
				break;

			case 'SHIELD_LARGE_BLOCK':
				this.block('BLOCK_LARGE');
				break;

			default:
				throw new Error('Invalid reaction skill');
		}
	}

	public selectEvasionTarget(target: Position) {
		const { state, action, reactor, evasionTargets } = this;

		if ('EVASION' !== state) {
			throw new Error('Could not select evasion target: invalid state ' + state);
		}

		if (null === action || !action.getSkills().length) {
			throw new Error('Could not select evasion target: invalid action');
		}

		if (!target.isContained(evasionTargets)) {
			// non-evasible position selected
			return;
		}
		this.state = 'DONE';
		this.evasionTarget = target;

		const skills = action.getSkills();
		const cost = skills[0].getCost();

		// update reacting character
		const AP = reactor.getAttribute('AP');
		reactor.setPosition(target);
		reactor.setAttribute('AP', AP - cost);

		this.events.onEvasionEnd(this);
		this.events.onEnd(this);
	}

	public pass(passAction: CharacterAction) {
		const { state} = this;

		if ('IDLE' !== state) {
			throw new Error('Could not pass reaction: invalid state ' + state);
		}
		this.state = 'DONE';
		this.action = passAction;

		this.events.onPass(this);
		this.events.onEnd(this);
	}

	public reset() {
		this.state = 'IDLE';
		this.action = null;
		this.evasionTarget = null;
		this.evasionTargets = [];

		this.events.onReset(this);
	}

	private evasionStart() {
		const { state, reactor, obstacles } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not start to evade: invalid state ' + state);
		}
		this.state = 'EVASION';

		// update reacting character
		const evasionArea = reactor.getPosition().getSideTiles(obstacles);
		this.evasionTargets = evasionArea;

		this.events.onEvasionStart(this);
	}

	private block(block: 'BLOCK_SMALL' | 'BLOCK_LARGE') {
		const { state } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not start to evade: invalid state ' + state);
		}
		this.state = 'DONE';
		this.reactor.applyStatus(block);

		this.events.onBlock(this);
		this.events.onEnd(this);
	}

	private prepareEvents(events: IActReactionEvents): IActReactionEvents {
		return {
			onStart: reaction => {
				Logger.log(`ActReaction onStart: "${reaction.getReactor().getData().name}"`);
				events.onStart(reaction);
			},
			onReactionSelected: reaction => {
				const action = reaction.getAction();
				Logger.log(`ActReaction onReactionSelected: "${action ? action.getTitle() : '-'}"`);
				events.onReactionSelected(reaction);
			},
			onBlock: reaction => {
				Logger.log('ActReaction onBlock');
				events.onBlock(reaction);
			},
			onEvasionStart: reaction => {
				Logger.log('ActReaction onEvasionStart');
				events.onEvasionStart(reaction);
			},
			onEvasionEnd: reaction => {
				const tgt = reaction.getEvasionTarget();
				Logger.log(`ActReaction onEvasionEnd: ${tgt ? `(${tgt.getX()}, ${tgt.getY()})` : '-'}`);
				events.onEvasionEnd(reaction);
			},
			onReset: reaction => {
				Logger.log('ActReaction onReset');
				events.onReset(reaction);
			},
			onPass: reaction => {
				Logger.log('ActReaction onPass');
				events.onPass(reaction);
			},
			onEnd: reaction => {
				Logger.log('ActReaction onEnd');
				events.onEnd(reaction);
			}
		};
	}
}

export default ActReaction;
