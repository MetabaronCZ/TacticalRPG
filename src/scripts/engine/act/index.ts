import { characterCTLimit } from 'data/game-config';

import Position from 'engine/position';
import Character from 'engine/character';
import BattleInfo from 'engine/battle-info';
import CharacterAction from 'engine/character-action';
import CharacterActions from 'engine/character-actions';

import ActMove from 'engine/act/movement';
import ActAction from 'engine/act/action';
import ActDirect from 'engine/act/direction';

type ActPhase = 'INIT' | 'IDLE' | 'MOVEMENT' | 'ACTION' | 'DIRECTION';

export interface IActEvents {
	onUpdate: () => void;
	onEnd: () => void;
}

class Act {
	private readonly id: number;
	private readonly actor: Character;
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
		this.events = events;

		this.movePhase = new ActMove(actor, characters, {
			onStart: move => {
				this.phase = 'MOVEMENT';
				this.update();

			},
			onSelect: move => {
				this.update();
			},
			onAnimation: (move, step) => {
				this.update();
			}
		});

		this.directPhase = new ActDirect(actor, {
			onStart: direct => {
				this.phase = 'DIRECTION';
				this.update();
			},
			onSelect: direct => {
				this.update();
				this.end();
			}
		});

		this.actionPhase = new ActAction(actor, characters, {
			onStart: action => {
				this.phase = 'ACTION';
				this.update();
			},
			onReset: action => {
				this.update();
			},
			onSelect: action => {
				this.update();
			}
		});

		this.init();
		this.movePhase.start();
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
		const { phase, actionPhase, movePhase } = this;

		switch (phase) {
			case 'MOVEMENT':
				// select movement target
				movePhase.selectTarget(position);
				return;

			case 'ACTION':
				// select skill target
				const actionState = actionPhase.getState();

				switch (actionState) {
					case 'IDLE':
					case 'SELECTED': {
						const prevTarget = actionPhase.getEffectTarget();

						// confirm target on double selection
						if (prevTarget && Position.isEqual(prevTarget, position)) {
							this.confirmAction();
							return;
						}
						actionPhase.selectTarget(position);
						return;
					}

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
				this.directPhase.select(position);
				return;

			default:
				return; // do nothing
		}
	}

	public selectAction(action: CharacterAction) {
		const { phase, actionPhase, directPhase, events } = this;
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
				actionPhase.start(action);
				return;
			}

			case 'PASS': {
				// start direct
				if ('MOVEMENT' !== phase) {
					throw new Error('Could not pass act: invalid phase ' + phase);
				}
				actionPhase.pass(action);
				directPhase.start();
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
						this.actionPhase.reset();
						this.phase = 'MOVEMENT';
						this.update();
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
		this.phase = 'IDLE';

		// regenerate actor AP
		const baseAP = actor.getBaseAttribute('AP');
		actor.setAttribute('AP', baseAP);

		this.update();
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

			this.update();
		}

		events.onEnd();
	}

	private confirmAction() {
		const { phase, actionPhase, directPhase, events } = this;

		if ('ACTION' !== phase) {
			throw new Error('Could not confirm action: invalid phase ' + phase);
		}
		actionPhase.confirm(
			this.setBattleInfo.bind(this),
			() => {
				this.updateActions();
				events.onUpdate();
			},
			step => {
				if (step.isLast) {
					directPhase.start();
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

				switch (state) {
					case 'IDLE':
						this.actions = CharacterActions.getSkillActions();
						break;

					case 'SELECTED':
						if (null === action) {
							throw new Error('Could not update actions: no action');
						}
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
				this.actions = [];
		}
	}

	private update() {
		this.updateActions();
		this.events.onUpdate();
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
