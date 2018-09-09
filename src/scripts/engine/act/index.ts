import { characterCTLimit } from 'data/game-config';

import Position from 'engine/position';
import Character from 'engine/character';
import BattleInfo from 'engine/battle-info';
import CharacterAction from 'engine/character-action';
import CharacterActions from 'engine/character-actions';

import ActMove from 'engine/act/movement';
import ActAction from 'engine/act/action';
import ActDirect from 'engine/act/direction';

type ActPhase = 'INIT' | 'MOVEMENT' | 'ACTION' | 'DIRECTION';

export interface IActEvents {
	onUpdate: () => void;
	onEnd: () => void;
}

class Act {
	private readonly id: number;
	private readonly actor: Character;
	private readonly characters: Character[] = [];
	private readonly events: IActEvents;

	private readonly movePhase: ActMove;
	private actionPhase: ActAction;
	private readonly directPhase: ActDirect;

	private phase: ActPhase = 'INIT';
	private actions: CharacterAction[] = [];
	private battleInfo: BattleInfo[] = [];

	constructor(id: number, actor: Character, characters: Character[], events: IActEvents) {
		this.id = id;
		this.actor = actor;
		this.characters = characters;
		this.events = events;

		this.movePhase = new ActMove(actor, characters);
		this.actionPhase = new ActAction(actor, characters);
		this.directPhase = new ActDirect(actor);

		this.init();
	}

	public getId(): number {
		return this.id;
	}

	public getActor(): Character {
		return this.actor;
	}

	public getActions(): CharacterAction[] {
		return this.actions;
	}

	public getPhase(): ActPhase {
		return this.phase;
	}

	public getMovePhase(): ActMove {
		return this.movePhase;
	}

	public getActionPhase(): ActAction {
		return this.actionPhase;
	}

	public getDirectPhase(): ActDirect {
		return this.directPhase;
	}

	public selectTile(position: Position) {
		const { phase, actionPhase, events } = this;

		switch (phase) {
			case 'MOVEMENT':
				// select movement target
				this.selectMoveTarget(position);
				return;

			case 'ACTION':
				// select skill target
				const actionState = actionPhase.getState();

				switch (actionState) {
					case 'IDLE':
					case 'SELECTED':
						this.selectActionTarget(position);
						return;

					case 'REACTION':
						const reaction = actionPhase.getReaction();

						if (null === reaction) {
							throw new Error('Could not select reaction target: invalid reaction');
						}
						if ('EVASION' === reaction.getState()) {
							reaction.selectEvasionTarget(position);
						}
						return;

					default:
						return; // do nothing
				}

			case 'DIRECTION':
				// select direction
				this.directPhase.select(position, () => {
					this.updateActions();
					events.onUpdate();
					this.end();
				});
				return;

			default:
				return; // do nothing
		}
	}

	public selectAction(action: CharacterAction) {
		const { phase, actor, characters, actionPhase, directPhase, events } = this;
		const actionId = action.getId();

		switch (actionId) {
			case 'ATTACK':
			case 'DOUBLE_ATTACK':
			case 'WEAPON':
			case 'MAGIC': {
				// start action
				if ('MOVEMENT' !== phase) {
					throw new Error('Could not select action: invalid phase ' + phase);
				}
				this.phase = 'ACTION';

				actionPhase.start(action);
				this.updateActions();
				events.onUpdate();
				return;
			}

			case 'PASS': {
				// start direct
				if ('MOVEMENT' !== phase) {
					throw new Error('Could not pass act: invalid phase ' + phase);
				}
				this.phase = 'DIRECTION';

				actionPhase.pass(action);
				directPhase.start();
				this.updateActions();
				events.onUpdate();
				return;
			}

			case 'REACTION': {
				// select reaction action
				if ('ACTION' !== phase) {
					throw new Error('Could not select reaction: invalid phase ' + phase);
				}
				const reaction = actionPhase.getReaction();

				if (null === reaction) {
					throw new Error('Could not select reaction: invalid reaction');
				}
				reaction.selectAction(action);
				this.updateActions();
				events.onUpdate();
				return;
			}

			case 'DONT_REACT': {
				// cancel react phase
				if ('ACTION' !== phase) {
					throw new Error('Could not cancel reaction: invalid phase ' + phase);
				}
				actionPhase.passReaction(action);
				this.updateActions();
				events.onUpdate();
				return;
			}

			case 'CONFIRM': {
				// confirm selected action
				this.confirmAction();
				return;
			}

			case 'BACK': {
				// cancel selected action
				if ('ACTION' !== phase) {
					throw new Error('Could not cancel action: invalid phase ' + phase);
				}
				const actionState = actionPhase.getState();

				switch (actionState) {
					case 'IDLE':
					case 'SELECTED':
						// remove current action >> goto move phase
						this.actionPhase = new ActAction(actor, characters);
						this.phase = 'MOVEMENT';
						this.updateActions();
						events.onUpdate();
						return;

					case 'REACTION':
						// reset selected reaction
						const reaction = actionPhase.getReaction();

						if (null === reaction) {
							throw new Error('Could not reset reaction: invalid reaction');
						}
						reaction.reset();
						this.updateActions();
						events.onUpdate();
						return;

					default:
						return; // do nothing
				}
			}

			default:
				throw new Error('Unsupported action: ' + actionId);
		}
	}

	private init() {
		const { phase, actor } = this;

		if ('INIT' !== phase) {
			throw new Error('Could not init act: invalid phase ' + phase);
		}
		this.phase = 'MOVEMENT';

		// regenerate actor AP
		const baseAP = actor.getBaseAttribute('AP');
		actor.setAttribute('AP', baseAP);

		this.updateActions();
	}

	private end() {
		const { phase, actor, events } = this;

		if ('DIRECTION' !== phase) {
			throw new Error('Could not end act: invalid phase ' + phase);
		}
		if (!actor.isDead()) {
			// update character CT
			const CT = actor.getAttribute('CT');
			actor.setAttribute('CT', CT % characterCTLimit);
		}
		events.onEnd();
	}

	private selectMoveTarget(target: Position) {
		const { phase, movePhase, events } = this;

		if ('MOVEMENT' !== phase) {
			throw new Error('Could not select move target: invalid phase ' + phase);
		}
		const animation = movePhase.selectTarget(target, step => {
			if (step.isLast) {
				this.phase = 'MOVEMENT';
				this.updateActions();
			}
			events.onUpdate();
		});

		if (null === animation) {
			return;
		}
		this.updateActions();
		events.onUpdate();

		animation.start();
	}

	private selectActionTarget(target: Position) {
		const { phase, actionPhase, events } = this;

		if ('ACTION' !== phase) {
			throw new Error('Could not select action target: invalid phase ' + phase);
		}
		const prevTarget = actionPhase.getEffectTarget();

		// confirm target on double selection
		if (prevTarget && Position.isEqual(prevTarget, target)) {
			this.confirmAction();
			return;
		}

		// select action target
		actionPhase.selectTarget(target, () => {
			this.updateActions();
			events.onUpdate();
		});
	}

	private confirmAction() {
		const { actionPhase, directPhase, events } = this;

		actionPhase.confirm(
			this.setBattleInfo.bind(this),
			() => {
				this.updateActions();
				events.onUpdate();
			},
			step => {
				if (step.isLast) {
					// start direct phase
					this.phase = 'DIRECTION';
					directPhase.start();
					this.updateActions();
				}
				events.onUpdate();
			}
		);

		this.updateActions();
		events.onUpdate();
	}

	private updateActions() {
		const { phase, actionPhase, movePhase, actor } = this;

		switch (phase) {
			case 'INIT':
			case 'DIRECTION':
				this.actions = [];
				break;

			case 'MOVEMENT':
				if ('IDLE' === movePhase.getState()) {
					this.actions = CharacterActions.getIdleActions(actor);
				} else {
					this.actions = [];
				}
				break;

			case 'ACTION': {
				const state = actionPhase.getState();
				const action = actionPhase.getAction();
				const reaction = actionPhase.getReaction();

				if (null === action) {
					throw new Error('Could not update actions: no action');
				}
				switch (state) {
					case 'IDLE':
						this.actions = CharacterActions.getSkillActions();
						break;

					case 'SELECTED':
						this.actions = CharacterActions.getSkillConfirmActions(action, actionPhase.getEffectTargets());
						break;

					case 'REACTION':
						if (null === reaction) {
							throw new Error('Could not set react actions: invalid reaction');
						}
						const reactionState = reaction.getState();

						switch (reactionState) {
							case 'IDLE':
								this.actions = CharacterActions.getReactiveActions(reaction.getReactor());
								break;
							case 'EVASION':
								this.actions = CharacterActions.getEvasiveActions();
								break;

							default:
								this.actions = [];
						}
						break;

					default:
						this.actions = [];
				}
				break;
			}

			default:
				throw new Error('Could not set actions: invalid game phase ' + phase);
		}
	}

	private setBattleInfo(text: string, position: Position, duration = 3000) {
		// set battle info item
		const item = new BattleInfo(text, position);
		this.battleInfo.push(item);

		// remove battle info item after fixed amount of time
		setTimeout(() => {
			for (let i = 0, imax = this.battleInfo.length; i < imax; i++) {
				if (this.battleInfo[i] === item) {
					this.battleInfo.splice(i, 1);
					break;
				}
			}
		}, duration);
	}
}

export default Act;
