import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import { StatusEffectID } from 'modules/battle/status-effect';
import CharacterAction from 'modules/battle/character-action';

export interface IActReactionRecord {
	readonly reactor: string;
	readonly action: string | null;
	readonly evasionTarget: string | null;
}

type Phase = 'INIT' | 'IDLE' | 'EVASION';
export type ReactionPhaseEvents = 'REACTION_IDLE' | 'REACTION_EVADING' | 'REACTION_FINISHED';

class ReactionPhase extends ActPhase<IActReactionRecord> {
	public readonly reactor: Character;
	public readonly backAttacked: boolean;
	private readonly characters: Character[];
	private readonly onEvent: IOnActPhaseEvent;

	private phase: Phase = 'INIT';
	private action: CharacterAction | null = null;
	private target: Tile | null = null;
	private evasible: Tile[] = [];

	constructor(reactor: Character, characters: Character[], backAttacked: boolean, onEvent: IOnActPhaseEvent) {
		super();

		this.reactor = reactor;this.onEvent = onEvent;
		this.characters = characters;
		this.backAttacked = backAttacked;
	}

	public getPhase(): Phase {
		return this.phase;
	}

	public getTarget(): Tile | null {
		return this.target;
	}

	public getEvasible(): Tile[] {
		return this.evasible;
	}

	public selectTile(tile: Tile) {
		if ('EVASION' === this.phase) {
			this.setEvasionTarget(tile);
		}
	}

	public selectAction(action: CharacterAction) {
		if (!action.active) {
			throw new Error('Could not select reaction: action not active');
		}
		switch (this.phase) {
			case 'IDLE':
				switch (action.type) {
					case 'REACTION':
						this.react(action);
						return;

					case 'DONT_REACT':
						this.pass(action);
						return;

					default:
						return; // do nothing
				}

			case 'EVASION':
				if ('BACK' === action.type) {
					this.cancelEvasion();
				}
				return;

			case 'INIT':
			default:
				return; // do nothing
		}
	}

	public start() {
		const { phase } = this;

		if ('INIT' !== phase) {
			throw new Error('Could not start reaction: invalid phase ' + phase);
		}
		this.phase = 'IDLE';
		this.onEvent('REACTION_IDLE');
	}

	public serialize(): IActReactionRecord {
		return {
			reactor: this.reactor.data.id,
			action: (this.action ? this.action.title : null),
			evasionTarget: (this.target ? this.target.id : null)
		};
	}

	private react(action: CharacterAction) {
		const { phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not set reaction: invalid phase ' + phase);
		}
		if (!action.active || !action.skills.length) {
			throw new Error('Could not react: invalid action');
		}

		if (this.backAttacked) {
			throw new Error('Cannot react if back attacked');
		}
		this.action = action;

		const skill = action.skills[0];

		switch (skill.id) {
			case 'ENERGY_SHIELD':
				this.apply('ENERGY_SHIELD');
				return;

			case 'SHD_SMALL_BLOCK':
				this.apply('BLOCK_SMALL');
				return;

			case 'SHD_LARGE_BLOCK':
				this.apply('BLOCK_LARGE');
				return;

			case 'EVADE':
				this.startEvasion();
				return;

			default:
				return; // do nothing
		}
	}

	private apply(effect: StatusEffectID) {
		const { phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not react: invalid state ' + phase);
		}
		this.reactor.status.apply(this.reactor, effect);
		this.onEvent('REACTION_FINISHED', this.action);
	}

	private cancelEvasion() {
		const { phase } = this;

		if ('EVASION' !== phase) {
			throw new Error('Could not cancel evasion: invalid phase ' + phase);
		}
		this.phase = 'IDLE';
		this.action = null;
		this.evasible = [];

		this.onEvent('REACTION_IDLE');
	}

	private pass(action: CharacterAction) {
		const { phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not pass reaction: invalid phase ' + phase);
		}
		this.action = action;
		this.onEvent('REACTION_FINISHED', action);
	}

	private startEvasion() {
		const { reactor, phase, characters } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not start evasion: invalid phase ' + phase);
		}
		this.phase = 'EVASION';

		const obstacles = characters.map(char => char.position);
		this.evasible = reactor.position.getSideTiles(obstacles);

		this.onEvent('REACTION_EVADING');
	}

	private setEvasionTarget(tile: Tile) {
		const { action, reactor, phase, evasible } = this;

		if ('EVASION' !== phase) {
			throw new Error('Could not set evasion target: invalid phase ' + phase);
		}

		if (null === action) {
			throw new Error('Could not set evasion target: invalid action');
		}

		if (!tile.isContained(evasible)) {
			// invalid tile selected
			return;
		}
		this.target = tile;

		const skill = action.skills[0];

		// update reacting character
		const { AP } = reactor.attributes;
		const newAp = AP - skill.apCost;

		if (newAp < 0) {
			throw new Error('Could not evade: could not afford to use skill');
		}
		reactor.position = tile;
		reactor.attributes.set('AP', newAp);

		this.onEvent('REACTION_FINISHED', action);
	}
}

export default ReactionPhase;
