import Position from 'engine/position';
import Character from 'engine/character';
import CharacterAction from 'engine/character-action';
import SkillUtils from 'engine/skill/utils';

export type ActReactionState = 'IDLE' | 'SELECTED' | 'EVASION' | 'BLOCK' | 'CANCELLED';
export type IOnReactEnd = () => void;

class ActReaction {
	private readonly id: number;
	private readonly reactor: Character;
	private readonly obstacles: Position[] = [];
	private state: ActReactionState = 'IDLE';
	private onEnd: IOnReactEnd;

	private action: CharacterAction|null = null;
	private evasionTarget: Position|null = null; // selected evasion tile position
	private evasionTargets: Position[] = []; // possible evasion positions of reacting character

	constructor(id: number, reactor: Character, obstacles: Position[], onEnd: IOnReactEnd) {
		this.id = id;
		this.reactor = reactor;
		this.obstacles = obstacles;
		this.onEnd = onEnd;
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

		const skillId = skills[0];

		switch (skillId) {
			case 'EVADE':
				this.evasionStart();

			case 'SHIELD_SMALL_BLOCK':
				this.block('BLOCK_SMALL');

			case 'SHIELD_LARGE_BLOCK':
				this.block('BLOCK_LARGE');

			default:
				throw new Error('Invalid reaction skill');
		}
	}

	public selectEvasionTarget(target: Position, cb: () => void) {
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
		this.evasionTarget = target;

		const skills = SkillUtils.getByID(action.getSkills());
		const cost = skills[0].getCost();

		// update reacting character
		const AP = reactor.getAttribute('AP');
		reactor.setPosition(target);
		reactor.setAttribute('AP', AP - cost);

		cb();
		this.onEnd();
	}

	public cancel() {
		const { state} = this;

		if ('IDLE' !== state) {
			throw new Error('Could not cancel reaction: invalid state ' + state);
		}
		this.state = 'CANCELLED';

		this.onEnd();
	}

	public reset() {
		this.state = 'IDLE';
		this.action = null;
		this.evasionTarget = null;
		this.evasionTargets = [];
	}

	private evasionStart() {
		const { state, reactor, obstacles } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not start to evade: invalid state ' + state);
		}
		this.state = 'EVASION';

		const evasionArea = reactor.getPosition().getSideTiles(obstacles);

		// update reacting character
		this.evasionTargets = evasionArea;
	}

	private block(block: 'BLOCK_SMALL' | 'BLOCK_LARGE') {
		const { state, reactor } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not start to evade: invalid state ' + state);
		}
		this.state = 'BLOCK';

		reactor.applyStatus(block);
		this.onEnd();
	}
}

export default ActReaction;
