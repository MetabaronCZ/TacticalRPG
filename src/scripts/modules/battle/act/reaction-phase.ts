import { resolveDirection } from 'modules/geometry/direction';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import ActPhase from 'modules/battle/act/phase';
import { IDamage } from 'modules/battle/damage';
import { IOnActPhaseEvent } from 'modules/battle/act';
import { StatusEffectID } from 'modules/battle/status-effect';
import CharacterAction from 'modules/battle/character-action';
import { IEffectTargetData } from 'modules/battle/act/action-phase';

export interface IActReactionRecord {
	reactions: Array<{
		readonly reactor: string;
		readonly action: string | null;
		readonly evasionTarget: string | null;
	}>;
}

type Phase = 'SUSPENDED' | 'IDLE' | 'DONE';
type IReactionPhase  = 'SUSPENDED' | 'IDLE' | 'EVASION';

export type ReactionPhaseEvents =
	'REACTION_IDLE' |
	'REACTION_EVADING' |
	'REACTION_FINISHED' |
	'REACTION_DONE';

interface IReaction {
	readonly reactor: Character;
	readonly combat: IDamage[];
	phase: IReactionPhase;
	action: CharacterAction | null;
	evasible: Tile[];
	evasionTarget: Tile | null;
}

class ReactionPhase extends ActPhase<IActReactionRecord> {
	private readonly actor: Character;
	private readonly characters: Character[];
	private readonly onEvent: IOnActPhaseEvent;

	private phase: Phase = 'SUSPENDED';
	private reaction: number = 0; // active reaction index
	private reactions: IReaction[] = [];

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();
		this.actor = actor;
		this.onEvent = onEvent;
		this.characters = characters;
	}

	public getActor(): Character | null {
		const reaction = this.getReaction();
		return reaction ? reaction.reactor : null;
	}

	public getPhase(): Phase {
		return this.phase;
	}

	public getReaction(): IReaction | null {
		return this.reactions[this.reaction] || null;
	}

	public getReactions(): IReaction[] {
		return this.reactions;
	}

	public selectTile(tile: Tile) {
		const reaction = this.getReaction();

		if (!reaction) {
			return;
		}
		if ('EVASION' === reaction.phase) {
			this.setEvasionTarget(reaction, tile);
		}
	}

	public selectAction(action: CharacterAction) {
		if (!action.isActive()) {
			throw new Error('Could not select reaction: action not active');
		}
		const reaction = this.getReaction();

		if (!reaction) {
			return;
		}
		switch (reaction.phase) {
			case 'IDLE':
				switch (action.type) {
					case 'REACTION':
						this.react(reaction, action);
						return;

					case 'DONT_REACT':
						this.pass(reaction, action);
						return;

					default:
						return; // do nothing
				}

			case 'EVASION':
				if ('BACK' === action.type) {
					this.cancelEvasion(reaction);
				}
				return;

			case 'SUSPENDED':
			default:
				return; // do nothing
		}
	}

	public start(combatInfo: IEffectTargetData[]) {
		const { phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start reaction: invalid phase ' + phase);
		}
		if (0 === combatInfo.length) {
			throw new Error('Could not start reaction: invalid data');
		}
		this.phase = 'IDLE';

		this.reactions = combatInfo.map(info => ({
			phase: 'SUSPENDED',
			reactor: info.character,
			combat: info.damage,
			action: null,
			evasible: [],
			evasionTarget: null
		}));

		this.startReact();
	}

	public serialize(): IActReactionRecord {
		return {
			reactions: this.reactions.map(({ reactor, action, evasionTarget }) => {
				const reaction = {
					reactor: reactor.data.id,
					action: (action ? action.title : null),
					evasionTarget: (evasionTarget ? evasionTarget.id : null)
				};
				return reaction;
			})
		};
	}

	private startReact() {
		const { actor, phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not start reaction: invalid phase ' + phase);
		}
		const reaction = this.getReaction();

		if (!reaction) {
			// all targets have reacted
			this.phase = 'DONE';
			this.onEvent('REACTION_DONE');
			return;
		}
		reaction.phase = 'IDLE';

		// turn actor to face active reactor
		actor.direction = resolveDirection(actor.position, reaction.reactor.position);

		this.onEvent('REACTION_IDLE');
	}

	private react(reaction: IReaction, action: CharacterAction) {
		const { phase, combat } = reaction;

		if ('IDLE' !== phase) {
			throw new Error('Could not set reaction: invalid phase ' + phase);
		}
		if (!action.isActive() || !action.skills.length) {
			throw new Error('Could not react: invalid action');
		}

		if (combat[0].backAttack) {
			throw new Error('Cannot react if back attacked');
		}
		reaction.action = action;

		const skill = action.skills[0];

		switch (skill.id) {
			case 'ENERGY_SHIELD':
				this.apply(reaction, 'ENERGY_SHIELD');
				return;

			case 'SHD_SMALL_BLOCK':
				this.apply(reaction, 'BLOCK_SMALL');
				return;

			case 'SHD_LARGE_BLOCK':
				this.apply(reaction, 'BLOCK_LARGE');
				return;

			case 'EVADE':
				this.startEvasion(reaction);
				return;

			default:
				return; // do nothing
		}
	}

	private apply(reaction: IReaction, effect: StatusEffectID) {
		const { reactor, phase } = reaction;

		if ('IDLE' !== phase) {
			throw new Error('Could not react: invalid state ' + phase);
		}
		reactor.status.apply(reactor, effect);
		this.finish(reaction);
	}

	private cancelEvasion(reaction: IReaction) {
		const { phase } = reaction;

		if ('EVASION' !== phase) {
			throw new Error('Could not cancel evasion: invalid phase ' + phase);
		}
		reaction.phase = 'IDLE';
		reaction.action = null;
		reaction.evasible = [];

		this.onEvent('REACTION_IDLE');
	}

	private pass(reaction: IReaction, action: CharacterAction) {
		const { phase } = reaction;

		if ('IDLE' !== phase) {
			throw new Error('Could not pass reaction: invalid phase ' + phase);
		}
		reaction.action = action;
		this.finish(reaction);
	}

	private startEvasion(reaction: IReaction) {
		const { characters } = this;
		const { reactor, phase } = reaction;

		if ('IDLE' !== phase) {
			throw new Error('Could not start evasion: invalid phase ' + phase);
		}
		reaction.phase = 'EVASION';

		const obstacles = characters.map(char => char.position);
		reaction.evasible = reactor.position.getSideTiles(obstacles);

		this.onEvent('REACTION_EVADING');
	}

	private setEvasionTarget(reaction: IReaction, tile: Tile) {
		const { action, reactor, phase, evasible } = reaction;

		if ('EVASION' !== phase) {
			throw new Error('Could not set evasion target: invalid phase ' + phase);
		}

		if (!action) {
			throw new Error('Could not set evasion target: invalid action');
		}

		if (!tile.isContained(evasible)) {
			// invalid tile selected
			return;
		}
		reaction.evasionTarget = tile;

		const skill = action.skills[0];

		// update reacting character
		const { AP } = reactor.attributes;
		const newAp = AP - skill.apCost;

		if (newAp < 0) {
			throw new Error('Could not evade: could not afford to use skill');
		}
		reactor.position = tile;
		reactor.attributes.set('AP', newAp);

		this.finish(reaction);
	}

	private finish(reaction: IReaction) {
		this.onEvent('REACTION_FINISHED', reaction.action);

		this.reaction++;
		this.startReact();
	}
}

export default ReactionPhase;
