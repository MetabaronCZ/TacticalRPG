import { getIntersection } from 'core/array';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import { getDamage, IDamage } from 'modules/battle/damage';
import CharacterAction from 'modules/battle/character-action';

export interface IActActionRecord {
	readonly action: string | null;
	readonly target: string | null;
}

export interface IEffectTargetData {
	character: Character;
	damage: IDamage[];
}

interface IActionPhaseState {
	action?: {
		data: CharacterAction;
		area: Tile[];
		targetable: Tile[];
		target?: {
			tile: Tile;
			character: Character | null;
			effectArea: Tile[];
			effectTargets: IEffectTargetData[];
		}
	};
}

type Phase = 'SUSPENDED' | 'IDLE' | 'TARGETING' | 'DONE';

export type ActionPhaseEvents =
	'ACTION_SELECTED' |
	'ACTION_PASSED' |
	'ACTION_CANCELLED' |
	'ACTION_TARGETED' |
	'ACTION_DONE';

class ActionPhase extends ActPhase<IActActionRecord> {
	private readonly actor: Character;
	private readonly characters: Character[];
	private readonly onEvent: IOnActPhaseEvent;
	private state: IActionPhaseState = {};
	private phase: Phase = 'SUSPENDED';

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();

		this.actor = actor;
		this.characters = characters.filter(char => !char.isDead());
		this.onEvent = onEvent;
	}

	public getActor(): Character {
		return this.actor;
	}

	public getPhase(): Phase {
		return this.phase;
	}

	public getAction(): CharacterAction | null {
		const { action } = this.state;
		return action ? action.data : null;
	}

	public getArea(): Tile[] {
		const { action } = this.state;
		return action ? action.area : [];
	}

	public getTargetable(): Tile[] {
		const { action } = this.state;
		return action ? action.targetable : [];
	}

	public getTarget(): Tile | null {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.tile : null;
	}

	public getEffectArea(): Tile[] {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.effectArea : [];
	}

	public getEffectTarget(): Character | null {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.character : null;
	}

	public getEffectTargets(): Character[] {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.effectTargets.map(eff => eff.character) : [];
	}

	public getCombatInfo(): IEffectTargetData[] {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.effectTargets : [];
	}

	public start(action: CharacterAction) {
		const { phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start action phase: invalid phase ' + phase);
		}
		this.phase = 'IDLE';
		this.selectAction(action);
	}

	public selectTile(tile: Tile) {
		if ('TARGETING' === this.phase) {
			const target = this.getTarget();

			if (target === tile) {
				this.confirm();
			} else {
				this.setTarget(tile);
			}
		}
	}

	public selectAction(action: CharacterAction) {
		if (!action.isActive()) {
			throw new Error('Could not select action: action not active');
		}
		switch (this.phase) {
			case 'IDLE':
				switch (action.type) {
					case 'ATTACK':
					case 'DOUBLE_ATTACK':
					case 'WEAPON':
					case 'MAGIC':
					case 'DYNAMIC': {
						// set new action phase
						if (!action.skills.length) {
							throw new Error('Could not select action: action has no skills');
						}
						this.set(action);
						return;
					}

					case 'PASS':
						// skip action phase
						this.pass(action);
						return;

					default:
						return; // do nothing
				}

			case 'TARGETING':
				switch (action.type) {
					case 'CONFIRM':
						// confirm selected action
						this.confirm();
						return;

					case 'BACK':
						// cancel selected action
						this.cancel();
						return;

					default:
						return; // do nothing
				}

			case 'SUSPENDED':
			default:
				return; // do nothing
		}
	}

	public serialize(): IActActionRecord {
		const action = this.getAction();
		const target = this.getEffectTarget();
		return {
			action: (action ? action.title : null),
			target: (target ? target.data.id : null)
		};
	}

	private setTarget(tile: Tile) {
		const { actor, phase, characters } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not set action target: invalid phase ' + phase);
		}
		const action = this.state.action;

		if (!action || !action.data.isActive()) {
			throw new Error('Could not select action target: invalid action');
		}
		const targets = this.getTargetable();

		if (!tile.isContained(targets)) {
			// tile not targetable
			return;
		}
		const { skills } = action.data;

		// get skill effect area
		const effectAreas = skills.map(s => s.getEffectArea(actor.position, tile));
		const effectArea = getIntersection(effectAreas);
		const effectTarget = characters.find(char => tile === char.position) || null;

		const effectTargets = skills[0]
			.getTargets(actor, characters, effectArea)
			.map(tgt => {
				return {
					character: tgt,
					damage: skills.map(skill => getDamage(actor, tgt, skill))
				};
			});

		action.target = {
			tile,
			effectArea,
			effectTargets,
			character: effectTarget
		};

		this.onEvent('ACTION_TARGETED', effectTarget);
	}

	private set(action: CharacterAction) {
		const { actor, characters, phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not set action: invalid phase ' + phase);
		}
		const allies = characters.filter(char => char.player === actor.player);
		const hitScanObstacles = allies.map(char => char.position);

		const skills = action.skills;
		const skillAreas = skills.map(skill => skill.getTargetable(actor.position, hitScanObstacles));
		const area = getIntersection(skillAreas);
		const targets = skills[0].getTargets(actor, characters, area);
		const targetable = targets.map(char => char.position);

		this.state.action = {
			data: action,
			area,
			targetable
		};
		this.phase = 'TARGETING';
		this.onEvent('ACTION_SELECTED', action);
	}

	private pass(action: CharacterAction) {
		const { phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not pass: invalid phase ' + phase);
		}
		this.state.action = {
			data: action,
			area: [],
			targetable: []
		};
		this.onEvent('ACTION_PASSED');
	}

	private cancel() {
		const { phase } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not cancel action: invalid phase ' + phase);
		}
		delete this.state.action;

		this.phase = 'SUSPENDED';
		this.onEvent('ACTION_CANCELLED');
	}

	private confirm() {
		const { phase } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not confirm action: invalid phase ' + phase);
		}
		this.phase = 'DONE';
		this.onEvent('ACTION_DONE');
	}
}

export default ActionPhase;
