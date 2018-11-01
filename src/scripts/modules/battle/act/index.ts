import Logger from 'modules/logger';
import Character from 'modules/character';
import Position from 'modules/geometry/position';
import { IBattleInfo } from 'modules/battle/battle-info';
import CharacterAction from 'modules/battle/character-action';
import { getIdleActions, getSkillActions, getSkillConfirmActions, getReactiveActions, getEvasiveActions } from 'modules/battle/character-actions';

import ActMove from 'modules/battle/act/movement';
import ActAction from 'modules/battle/act/action';
import ActDirect from 'modules/battle/act/direction';

type ActPhase = 'INIT' | 'IDLE' | 'MOVEMENT' | 'ACTION' | 'DIRECTION';

export interface IActEvents {
	onStart: (act: Act) => void;
	onUpdate: (act: Act) => void;
	onEnd: (act: Act) => void;
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
	private battleInfo: IBattleInfo[] = [];

	constructor(id: number, actor: Character, characters: Character[], events: IActEvents) {
		this.id = id;
		this.actor = actor;
		this.events = this.prepareEvents(events);

		this.movePhase = new ActMove(actor, characters, {
			onStart: move => {
				this.phase = 'MOVEMENT';
				this.update();
			},
			onSelect: move => this.update(),
			onAnimation: (move, step) => this.update(),
			onEnd: move => this.update()
		});

		this.directPhase = new ActDirect(actor, {
			onStart: direct => {
				this.phase = 'DIRECTION';
				this.update();
			},
			onSelect: direct => this.update(),
			onEnd: direct => {
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
				this.phase = 'MOVEMENT';
				this.update();
			},
			onSelect: action => this.update(),
			onConfirm: action => this.update(),
			onPass: action => this.update(),
			onAnimation: (action, step) => this.update(),
			onEnd: action => {
				this.update();
				this.directPhase.start();
			},

			onReactionStart: reaction => this.update(),
			onReactionSelected: reaction => this.update(),
			onReactionBlock: reaction => this.update(),
			onReactionEvasionStart: reaction => this.update(),
			onReactionEvasionEnd: reaction => this.update(),
			onReactionPass: reaction => this.update(),
			onReactionReset: reaction => this.update(),
			onReactionEnd: reaction => this.update(),

			onBattleInfo: (text, position) => {
				this.update();
				this.setBattleInfo(text, position);
			},
		});
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

	public getBattleInfo(): IBattleInfo[] {
		return this.battleInfo;
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

	public start() {
		const { phase, actor } = this;

		if ('INIT' !== phase) {
			throw new Error('Could not init act: invalid phase ' + phase);
		}
		this.phase = 'IDLE';

		actor.startAct();
		this.events.onStart(this);
		this.movePhase.start();
	}

	public selectTile(position: Position) {
		const { phase, actionPhase, movePhase, directPhase } = this;

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
						if (prevTarget === position) {
							actionPhase.confirm();
						} else {
							actionPhase.selectTarget(position);
						}
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
				directPhase.select(position);
				return;

			default:
				return; // do nothing
		}
	}

	public selectAction(action: CharacterAction) {
		const { phase, actionPhase } = this;
		const actionId = action.id;

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
				return;
			}

			case 'DONT_REACT': {
				// cancel react phase
				if ('ACTION' !== phase) {
					throw new Error('Could not cancel reaction: invalid phase ' + phase);
				}
				actionPhase.passReaction(action);
				return;
			}

			case 'CONFIRM': {
				// confirm selected action
				if ('ACTION' !== phase) {
					throw new Error('Could not confirm action: invalid phase ' + phase);
				}
				actionPhase.confirm();
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
						return;

					case 'REACTION':
						// reset selected reaction
						const reaction = actionPhase.getReaction();

						if (null === reaction) {
							throw new Error('Could not reset reaction: invalid reaction');
						}
						reaction.reset();
						return;

					default:
						return; // do nothing
				}
			}

			default:
				throw new Error('Unsupported action: ' + actionId);
		}
	}

	private end() {
		const { phase, actor } = this;

		if ('DIRECTION' !== phase) {
			throw new Error('Could not end act: invalid phase ' + phase);
		}

		if (!actor.isDead()) {
			actor.endAct();
			this.update();
		}
		this.events.onEnd(this);
	}

	private updateActions() {
		switch (this.phase) {
			case 'MOVEMENT': {
				if ('IDLE' === this.movePhase.getState()) {
					this.actions = getIdleActions(this.actor);
				} else {
					this.actions = [];
				}
				break;
			}

			case 'ACTION': {
				const actionPhase = this.actionPhase;
				const state = actionPhase.getState();

				switch (state) {
					case 'IDLE':
						this.actions = getSkillActions();
						break;

					case 'SELECTED': {
						const action = actionPhase.getAction();

						if (null === action) {
							throw new Error('Could not update actions: no action');
						}
						this.actions = getSkillConfirmActions(action, actionPhase.getEffectTargets());
						break;
					}

					case 'REACTION': {
						const reaction = actionPhase.getReaction();

						if (null === reaction) {
							throw new Error('Could not set react actions: invalid reaction');
						}
						const reactionState = reaction.getState();

						switch (reactionState) {
							case 'IDLE':
								this.actions = getReactiveActions(reaction.getReactor(), reaction.isBackAttacked());
								break;
							case 'EVASION':
								this.actions = getEvasiveActions();
								break;

							default:
								this.actions = [];
						}
						break;
					}

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
		this.events.onUpdate(this);
	}

	private setBattleInfo(text: string, position: Position, duration = 3000) {
		const infos = this.battleInfo;

		// set battle info item
		const item: IBattleInfo = { text, position };
		infos.push(item);

		this.update();

		// remove battle info item after fixed amount of time
		setTimeout(() => {
			for (let i = 0, imax = infos.length; i < imax; i++) {
				if (infos[i] === item) {
					infos.splice(i, 1);
					this.update();
					break;
				}
			}
		}, duration);
	}

	private prepareEvents(events: IActEvents): IActEvents {
		return {
			onStart: act => {
				Logger.info(`Act onStart: "${act.getActor().name}"`);
				events.onStart(act);
			},
			onUpdate: events.onUpdate,
			onEnd: act => {
				Logger.info('Act onEnd');
				events.onEnd(act);
			}
		};
	}
}

export default Act;
