import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Character from 'modules/character';
import { IBattleInfo } from 'modules/battle/battle-info';
import CharacterAction from 'modules/battle/character-action';
import * as CharacterActions from 'modules/battle/character-actions';

import ActMove, { IActMoveRecord } from 'modules/battle/act/movement';
import ActAction, { IActActionRecord } from 'modules/battle/act/action';
import ActDirect, { IActDirectRecord } from 'modules/battle/act/direction';

type ActPhase = 'INIT' | 'IDLE' | 'SKIPPING' | 'MOVEMENT' | 'ACTION' | 'DIRECTION';

export interface IActEvents {
	onStart: (act: Act) => void;
	onUpdate: (act: Act) => void;
	onSkip: (act: Act) => void;
	onEnd: (act: Act) => void;
	onBattleInfo: (info: IBattleInfo) => void;
}

export interface IActRecord {
	readonly id: number;
	readonly actor: string;
	readonly skipped: boolean;
	readonly movePhase: IActMoveRecord;
	readonly actionPhase: IActActionRecord;
	readonly directPhase: IActDirectRecord;
}

class Act {
	private readonly id: number;
	private readonly actor: Character;
	private readonly characters: Character[];
	private readonly events: IActEvents;

	private readonly movePhase: ActMove;
	private actionPhase: ActAction;
	private readonly directPhase: ActDirect;

	private phase: ActPhase = 'INIT';
	private actions: CharacterAction[] = [];
	private skipped: boolean = false;

	constructor(id: number, actor: Character, characters: Character[], events: IActEvents) {
		this.id = id;
		this.actor = actor;
		this.characters = characters;
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
			onPass: action => {
				this.phase = 'ACTION';
				this.update();
			},
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

			onBattleInfo: this.events.onBattleInfo
		});
	}

	public getId(): number {
		return this.id;
	}

	public getActor(): Character {
		return this.actor;
	}

	public getActingCharacter(): Character {
		const reaction = this.actionPhase.getReaction();
		const isReaction = ('ACTION' === this.phase && reaction && 'DONE' !== reaction.getState());
		return (isReaction && reaction ? reaction.getReactor() : this.actor);
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

	public start() {
		const { phase, actor } = this;

		if ('INIT' !== phase) {
			throw new Error('Could not init act: invalid phase ' + phase);
		}
		this.phase = 'IDLE';

		actor.startAct();
		this.events.onStart(this);

		setTimeout(() => { // prevent race condition
			if (actor.status.has('DYING')) {
				this.skip();
			} else {
				this.movePhase.start();
			}
		});
	}

	public selectTile(tile: Tile) {
		const { phase, actionPhase, movePhase, directPhase } = this;

		switch (phase) {
			case 'MOVEMENT':
				// select movement target
				movePhase.selectTarget(tile);
				return;

			case 'ACTION':
				// select skill target
				const actionState = actionPhase.getState();

				switch (actionState) {
					case 'IDLE':
					case 'SELECTED': {
						const prevTarget = actionPhase.getEffectTarget();

						// confirm target on double selection
						if (prevTarget === tile) {
							actionPhase.confirm();
						} else {
							actionPhase.selectTarget(tile);
						}
						return;
					}

					case 'REACTION':
						const reaction = actionPhase.getReaction();

						if (null === reaction) {
							throw new Error('Could not select reaction target: invalid reaction');
						}
						if ('EVASION' === reaction.getState()) {
							reaction.selectEvasionTarget(tile);
						}
						return;

					default:
						return; // do nothing
				}

			case 'DIRECTION':
				// select direction
				directPhase.select(tile);
				return;

			default:
				return; // do nothing
		}
	}

	public selectAction(action: CharacterAction) {
		const { actor, phase, actionPhase, characters } = this;

		switch (action.id) {
			case 'ATTACK':
			case 'DOUBLE_ATTACK':
			case 'WEAPON':
			case 'MAGIC':
			case 'DYNAMIC': {
				// start action
				if ('MOVEMENT' !== phase) {
					throw new Error('Could not select action: invalid phase ' + phase);
				}
				const allies = characters.filter(char => char.player === actor.player);
				const obstacles = allies.map(char => char.position);
				actionPhase.start(action, obstacles);
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
				throw new Error('Unsupported action: ' + action.id);
		}
	}

	public serialize(): IActRecord {
		return {
			id: this.id,
			skipped: this.skipped,
			actor: this.actor.data.id,
			movePhase: this.movePhase.serialize(),
			actionPhase: this.actionPhase.serialize(),
			directPhase: this.directPhase.serialize()
		};
	}

	private skip() {
		this.phase = 'SKIPPING';
		this.skipped = true;

		this.events.onSkip(this);

		setTimeout(() => { // prevent race condition
			this.end();
		});
	}

	private end() {
		const { phase, actor } = this;

		if ('DIRECTION' !== phase && 'SKIPPING' !== phase) {
			throw new Error('Could not end act: invalid phase ' + phase);
		}

		if (!actor.isDead()) {
			actor.endAct();
			this.update();
		}
		this.events.onEnd(this);
	}

	private updateActions() {
		const { actor, movePhase, actionPhase, directPhase } = this;

		if (actor.status.has('DYING')) {
			this.actions = [];
			return;
		}

		switch (this.phase) {
			case 'MOVEMENT': {
				this.actions = [];

				if ('IDLE' === movePhase.getState()) {
					const actions = CharacterActions.getIdleActions(actor);

					if (!actor.isAI()) {
						// player move and/or choose actions
						this.actions = actions;

					} else {
						// let AI decide
						(actor.player as AIPlayer).onAction({
							actor,
							actions,
							movable: movePhase.getMovable(),
							onTileSelect: tile => this.selectTile(tile),
							onActionSelect: action => this.selectAction(action)
						});
					}
				}
				break;
			}

			case 'ACTION': {
				switch (actionPhase.getState()) {
					case 'IDLE': {
						const actions = CharacterActions.getSkillActions();
						this.actions = [];

						if (!actor.isAI()) {
							// player chooses action target
							this.actions = actions;

						} else {
							// let AI choose target
							const player = actor.player as AIPlayer;
							player.onActionTarget(actor, actionPhase.getTargetable(), tile => this.selectTile(tile));
						}
						break;
					}

					case 'SELECTED': {
						const action = actionPhase.getAction();

						if (null === action) {
							throw new Error('Could not update actions: no action');
						}
						this.actions = [];

						const actions = CharacterActions.getSkillConfirmActions(action, actionPhase.getEffectTargets());

						if (!actor.isAI()) {
							// player decide action confirmation
							this.actions = actions;

						} else {
							// let AI confirm action
							const player = actor.player as AIPlayer;
							player.onActionConfirm(actions, a => this.selectAction(a));
						}
						break;
					}

					case 'REACTION': {
						const reaction = actionPhase.getReaction();

						if (null === reaction) {
							throw new Error('Could not set react actions: invalid reaction');
						}
						this.actions = [];

						const reactor = reaction.getReactor();
						const reactionState = reaction.getState();
						const isBackAttacked = reaction.isBackAttacked();
						const canEvade = reaction.canEvade();

						switch (reactionState) {
							case 'IDLE': {
								const actions = CharacterActions.getReactiveActions(reactor, isBackAttacked, canEvade);

								if (!reactor.isAI()) {
									// player chooses reaction
									this.actions = actions;

								} else {
									// let AI choose reaction
									const player = reactor.player as AIPlayer;
									player.onReaction(reactor, actions, isBackAttacked, r => this.selectAction(r));
								}
								break;
							}

							case 'EVASION': {
								const actions = CharacterActions.getEvasiveActions();

								if (!reactor.isAI()) {
									// player chooses reaction
									this.actions = actions;

								} else {
									// let AI choose reaction
									const player = reactor.player as AIPlayer;
									player.onEvasion(reactor, reaction.getEvasionTargets(), tile => this.selectTile(tile));
								}
								break;
							}

							default:
								// pass
						}
						break;
					}

					default:
						this.actions = [];
				}
				break;
			}

			case 'DIRECTION':
				this.actions = [];

				if ('IDLE' === directPhase.getState()) {
					if (actor.isAI()) {
						const player = actor.player as AIPlayer;
						player.onDirect(actor, directPhase.getDirectable(), tile => this.selectTile(tile));
					}
				}
				break;

			default:
				this.actions = [];
		}
	}

	private update() {
		this.updateActions();
		this.events.onUpdate(this);
	}

	private prepareEvents(events: IActEvents): IActEvents {
		return {
			onStart: act => {
				Logger.info(`Act onStart: "${act.getActor().name}"`);
				events.onStart(act);
			},
			onUpdate: events.onUpdate,
			onSkip: act => {
				Logger.info('Act onSkip');
				events.onSkip(act);
			},
			onEnd: act => {
				Logger.info('Act onEnd');
				events.onEnd(act);
			},
			onBattleInfo: events.onBattleInfo
		};
	}
}

export default Act;
